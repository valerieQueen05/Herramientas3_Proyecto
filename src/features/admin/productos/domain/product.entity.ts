export type Product = {
  id: number;
  titulo: string;
  descripcion: string | null;
  url: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  imagen: string | null;
  activo: boolean;
  categoriaId: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export interface ICreate {
  titulo: string;
  url: string;
  precioCompra: number;
  precioVenta: number;
  stock?: number;
  imagen?: string;
  categoriaId: number;
  descripcion?: string;
}

export interface IUpdate {
  id: number;
  titulo?: string;
  url?: string;
  activo?: boolean;
  precioCompra?: number;
  precioVenta?: number;
  stock?: number;
  imagen?: string;
  categoriaId?: number;
  descripcion?: string;
}