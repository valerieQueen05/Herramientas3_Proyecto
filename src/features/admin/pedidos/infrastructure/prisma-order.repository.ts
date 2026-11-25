import { prisma } from "@/src/commons/lib/prisma";
import { logger } from "@/src/commons/utils/logger";
import {
  EstadoPedido,
  ICreateOrderInput,
  IListOrdersFilter,
  IUpdateOrderStatusInput,
  Order,
  OrderActionResult,
} from "../domain/order.entity";
import { OrderRepository } from "../domain/order.repository";

const orderInclude = {
  usuario: {
    select: {
      nombre: true,
      apellido: true,
      email: true,
    },
  },
  detalles: {
    include: {
      producto: {
        select: {
          titulo: true,
          imagen: true,
        },
      },
    },
  },
} as const;

type PrismaOrderRow = NonNullable<
  Awaited<ReturnType<typeof prisma.pedido.findFirst<{ include: typeof orderInclude }>>>
>;

const toOrder = (row: PrismaOrderRow): Order => ({
  id: row.id,
  direccion: row.direccion ?? "",
  total: Number(row.total),
  estado: row.estado,
  fechaCreacion: row.fechaCreacion.toISOString(),
  fechaActualizacion: row.fechaActualizacion.toISOString(),
  usuarioId: row.usuarioId,
  cliente: `${row.usuario.nombre} ${row.usuario.apellido}`.trim(),
  clienteEmail: row.usuario.email,
  detalles: row.detalles.map((d) => ({
    id: d.id,
    productoId: d.productoId,
    nombre: d.producto.titulo,
    imagen: d.producto.imagen,
    cantidad: d.cantidad,
    precioUnitario: Number(d.precioUnitario),
  })),
});

const TRANSICIONES_VALIDAS: Record<EstadoPedido, EstadoPedido[]> = {
  SOLICITADO: ["PENDIENTE", "CANCELADO"],
  PENDIENTE: ["ENTREGADO", "CANCELADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

// Único archivo de pedidos que habla con la base de datos (Prisma)
export class PrismaOrderRepository implements OrderRepository {
  async list(filter?: IListOrdersFilter): Promise<Order[] | false> {
    try {
      const rows = await prisma.pedido.findMany({
        where: {
          ...(filter?.usuarioId !== undefined ? { usuarioId: filter.usuarioId } : {}),
          ...(filter?.estado !== undefined ? { estado: filter.estado } : {}),
        },
        include: orderInclude,
        orderBy: { fechaCreacion: "desc" },
      });

      return rows.map(toOrder);
    } catch (error) {
      logger({ error: error as Error, module: "PrismaOrderRepository.list" });
      return false;
    }
  }

  async getById(id: number): Promise<Order | false> {
    try {
      const row = await prisma.pedido.findUnique({
        where: { id },
        include: orderInclude,
      });

      return row ? toOrder(row) : false;
    } catch (error) {
      logger({ error: error as Error, module: "PrismaOrderRepository.getById" });
      return false;
    }
  }

  async create(data: ICreateOrderInput): Promise<OrderActionResult<{ id: number }>> {
    try {
      // Agrupa cantidades por producto por si el cliente manda el mismo id repetido
      const cantidadesPorProducto = new Map<number, number>();
      for (const item of data.items) {
        cantidadesPorProducto.set(
          item.productoId,
          (cantidadesPorProducto.get(item.productoId) ?? 0) + item.cantidad
        );
      }

      const productIds = Array.from(cantidadesPorProducto.keys());

      const result = await prisma.$transaction(async (tx) => {
        const productos = await tx.producto.findMany({
          where: { id: { in: productIds }, activo: true },
          select: { id: true, titulo: true, precioVenta: true, stock: true },
        });

        if (productos.length !== productIds.length) {
          return {
            ok: false as const,
            error: "Uno o más productos ya no están disponibles",
            status: 400,
          };
        }

        let total = 0;
        const detallesData: { productoId: number; cantidad: number; precioUnitario: number }[] = [];

        for (const producto of productos) {
          const cantidad = cantidadesPorProducto.get(producto.id) ?? 0;
          if (cantidad <= 0) {
            return {
              ok: false as const,
              error: `Cantidad inválida para ${producto.titulo}`,
              status: 422,
            };
          }
          if (producto.stock < cantidad) {
            return {
              ok: false as const,
              error: `Stock insuficiente para ${producto.titulo} (disponible: ${producto.stock})`,
              status: 409,
            };
          }

          const precioUnitario = Number(producto.precioVenta);
          total += precioUnitario * cantidad;
          detallesData.push({
            productoId: producto.id,
            cantidad,
            precioUnitario,
          });
        }

        // Descontamos el stock dentro de la misma transacción
        for (const item of detallesData) {
          await tx.producto.update({
            where: { id: item.productoId },
            data: { stock: { decrement: item.cantidad } },
          });
        }

        const pedido = await tx.pedido.create({
          data: {
            direccion: data.direccion,
            total,
            estado: "SOLICITADO",
            usuarioId: data.usuarioId,
            creadoPorId: data.usuarioId,
            detalles: {
              create: detallesData,
            },
          },
          select: { id: true },
        });

        return { ok: true as const, data: { id: pedido.id } };
      });

      return result;
    } catch (error) {
      logger({ error: error as Error, module: "PrismaOrderRepository.create" });
      return { ok: false, error: "Error al crear el pedido", status: 500 };
    }
  }

  async updateStatus(data: IUpdateOrderStatusInput): Promise<OrderActionResult> {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const pedido = await tx.pedido.findUnique({
          where: { id: data.id },
          include: {
            detalles: {
              select: { productoId: true, cantidad: true },
            },
          },
        });

        if (!pedido) {
          return { ok: false as const, error: "El pedido no existe", status: 404 };
        }

        const permitidos = TRANSICIONES_VALIDAS[pedido.estado];
        if (!permitidos.includes(data.estado)) {
          return {
            ok: false as const,
            error: `No se puede cambiar el pedido de ${pedido.estado} a ${data.estado}`,
            status: 400,
          };
        }

        // Si se cancela un pedido activo, devolvemos el stock a cada producto
        if (data.estado === "CANCELADO") {
          for (const detalle of pedido.detalles) {
            await tx.producto.update({
              where: { id: detalle.productoId },
              data: { stock: { increment: detalle.cantidad } },
            });
          }
        }

        await tx.pedido.update({
          where: { id: data.id },
          data: {
            estado: data.estado,
            actualizadoPorId: data.actualizadoPorId,
          },
        });

        return { ok: true as const };
      });

      return result;
    } catch (error) {
      logger({ error: error as Error, module: "PrismaOrderRepository.updateStatus" });
      return { ok: false, error: "Error al actualizar el pedido", status: 500 };
    }
  }
}
