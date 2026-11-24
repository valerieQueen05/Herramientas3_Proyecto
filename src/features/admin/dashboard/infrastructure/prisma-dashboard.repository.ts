import { prisma } from "@/src/commons/lib/prisma";
import { logger } from "@/src/commons/utils/logger";
import { IDashboardRaw, IPeriodos, IVentasPeriodo } from "../domain/dashboard.entity";
import { DashboardRepository } from "../domain/dashboard.repository";

// Único archivo del dashboard que habla con la base de datos (Prisma)
export class PrismaDashboardRepository implements DashboardRepository {

    async getResumen(periodos: IPeriodos, limite: number): Promise<IDashboardRaw | boolean> {
        try {
            // Promise.all lanza las 4 consultas a la vez y espera a que terminen todas
            const [porEstado, pedidosEntregados, vendidos, clientes] = await Promise.all([
                // 1. Pedidos de hoy agrupados por estado (cuántos SOLICITADO, ENTREGADO...)
                prisma.pedido.groupBy({
                    by: ["estado"],
                    where: { fechaCreacion: { gte: periodos.hoy } },
                    _count: { _all: true },
                }),

                // 2. Pedidos ENTREGADOS desde el inicio del periodo más largo (semana o mes),
                //    con sus productos, para calcular ventas, ingresos y utilidad
                prisma.pedido.findMany({
                    where: {
                        estado: "ENTREGADO",
                        fechaCreacion: { gte: periodos.semana < periodos.mes ? periodos.semana : periodos.mes },
                    },
                    select: {
                        fechaCreacion: true,
                        total: true,
                        detalles: { select: { cantidad: true, producto: { select: { precioCompra: true } } } },
                    },
                }),

                // 3. Productos más vendidos: suma de cantidades por producto
                //    (sin pedidos cancelados ni productos eliminados)
                prisma.detallePedido.groupBy({
                    by: ["productoId"],
                    where: { pedido: { estado: { not: "CANCELADO" } }, producto: { activo: true } },
                    _sum: { cantidad: true },
                    orderBy: { _sum: { cantidad: "desc" } },
                    take: limite,
                }),

                // 4. Clientes fieles: cantidad de pedidos por usuario
                //    (sin pedidos cancelados ni usuarios eliminados)
                prisma.pedido.groupBy({
                    by: ["usuarioId"],
                    where: { estado: { not: "CANCELADO" }, usuario: { activo: true } },
                    _count: { _all: true },
                    orderBy: { _count: { usuarioId: "desc" } },
                    take: limite,
                }),
            ]);

            // groupBy solo devuelve ids: traemos los datos de esos productos y usuarios
            const [productos, usuarios] = await Promise.all([
                prisma.producto.findMany({
                    where: { id: { in: vendidos.map((v) => v.productoId) } },
                    include: { categoria: { select: { titulo: true } } },
                }),
                prisma.usuario.findMany({
                    where: { id: { in: clientes.map((c) => c.usuarioId) } },
                    select: { id: true, nombre: true, apellido: true },
                }),
            ]);

            // Suma ventas, ingresos y costo de los pedidos entregados desde una fecha
            const resumir = (desde: Date): IVentasPeriodo => {
                const delPeriodo = pedidosEntregados.filter((p) => p.fechaCreacion >= desde);
                const ingresos = delPeriodo.reduce((acc, p) => acc + Number(p.total), 0);
                const costo = delPeriodo.reduce(
                    (acc, p) => acc + p.detalles.reduce(
                        (suma, d) => suma + d.cantidad * Number(d.producto.precioCompra), 0),
                    0
                );
                return { ventas: delPeriodo.length, ingresos, utilidad: ingresos - costo };
            };

            return {
                pedidosHoyPorEstado: porEstado.map((g) => ({ estado: g.estado, cantidad: g._count._all })),
                ventas: {
                    dia: resumir(periodos.hoy),
                    semana: resumir(periodos.semana),
                    mes: resumir(periodos.mes),
                },
                // Recorremos "vendidos" (ya viene ordenado) y le pegamos los datos de cada producto
                masVendidos: vendidos.flatMap((v) => {
                    const p = productos.find((prod) => prod.id === v.productoId);
                    if (!p) return [];
                    return [{
                        id: p.id,
                        nombre: p.titulo,
                        categoria: p.categoria.titulo,
                        imagen: p.imagen,
                        vendidos: v._sum.cantidad ?? 0,
                        stock: p.stock,
                        precio: Number(p.precioVenta),
                    }];
                }),
                clientesFieles: clientes.flatMap((c) => {
                    const u = usuarios.find((usr) => usr.id === c.usuarioId);
                    if (!u) return [];
                    return [{ id: u.id, nombre: `${u.nombre} ${u.apellido}`, pedidos: c._count._all }];
                }),
            };
        } catch (error) {
            logger({ error: error as Error, module: "PrismaDashboardRepository.getResumen" });
            return false;
        }
    }
}
