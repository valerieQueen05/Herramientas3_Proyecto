export interface ProductoPedido {
  nombre: string;
  cantidad: number;
  precioUnit: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  cliente: string;
  ubicacion: string;
  estado: "Solicitado" | "Pendiente" | "Entregado" | "Cancelado";
  productos: ProductoPedido[];
}
