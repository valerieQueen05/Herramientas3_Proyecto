// Mismos valores del enum EstadoPedido en prisma/schema.prisma
export type EstadoPedido = "SOLICITADO" | "PENDIENTE" | "ENTREGADO" | "CANCELADO";

export interface OrderItemInput {
  productoId: number;
  cantidad: number;
}

export interface OrderDetail {
  id: number;
  productoId: number;
  nombre: string;
  imagen: string | null;
  cantidad: number;
  precioUnitario: number;
}

export interface Order {
  id: number;
  direccion: string;
  total: number;
  estado: EstadoPedido;
  fechaCreacion: string;
  fechaActualizacion: string;
  usuarioId: number;
  cliente: string;
  clienteEmail: string;
  detalles: OrderDetail[];
}

export interface ICreateOrderInput {
  usuarioId: number;
  direccion: string;
  items: OrderItemInput[];
}

export interface IUpdateOrderStatusInput {
  id: number;
  estado: EstadoPedido;
  actualizadoPorId: number;
}

export interface IListOrdersFilter {
  usuarioId?: number;
  estado?: EstadoPedido;
}

export type OrderActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { data: T }))
  | { ok: false; error: string; status: number };
