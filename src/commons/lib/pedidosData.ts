import { Pedido } from "@/src/commons/types/pedido";
import { Order } from "@/src/features/admin/pedidos/domain/order.entity";

export const formatoCOP = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

export const valorPedido = (pedido: Pedido) =>
  pedido.productos.reduce((acc, p) => acc + p.cantidad * p.precioUnit, 0);

const capitalizarEstado = (estado: Order["estado"]): Pedido["estado"] =>
  (estado.charAt(0) + estado.slice(1).toLowerCase()) as Pedido["estado"];

const pad = (n: number) => String(n).padStart(2, "0");

export const formatearFechaLocal = (iso: string): { fecha: string; fechaISO: string } => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { fecha: iso, fechaISO: iso.slice(0, 10) };
  }
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return {
    fecha: `${yyyy}-${mm}-${dd} ${hh}:${min}`,
    fechaISO: `${yyyy}-${mm}-${dd}`,
  };
};

// La API devuelve los campos de la BD (estado en mayúsculas, detalles...);
// la tabla y los modales usan la forma Pedido.
export const orderToPedido = (o: Order): Pedido => {
  const { fecha, fechaISO } = formatearFechaLocal(o.fechaCreacion);
  return {
    id: o.id,
    fecha,
    fechaISO,
    cliente: o.cliente,
    ubicacion: o.direccion || "Sin dirección",
    estado: capitalizarEstado(o.estado),
    productos: o.detalles.map((d) => ({
      productoId: d.productoId,
      nombre: d.nombre,
      cantidad: d.cantidad,
      precioUnit: d.precioUnitario,
    })),
  };
};
