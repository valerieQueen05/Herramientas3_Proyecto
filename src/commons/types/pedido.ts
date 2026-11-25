export interface ProductoPedido {
  productoId?: number;
  nombre: string;
  cantidad: number;
  precioUnit: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  fechaISO: string;
  cliente: string;
  ubicacion: string;
  estado: "Solicitado" | "Pendiente" | "Entregado" | "Cancelado";
  productos: ProductoPedido[];
}
