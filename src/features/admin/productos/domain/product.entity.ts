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

// Lo que devuelve el listado: el producto + el nombre de su categoría
export type ProductList = Product & {
  categoria: { titulo: string };
};

export interface ICreate {
  titulo: string;
  url: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock?: number;
  imagen?: string;
  activo?: boolean;
  categoriaId: number;
}

export interface IUpdate {
  id: number;
  titulo?: string;
  url?: string;
  descripcion?: string;
  precioCompra?: number;
  precioVenta?: number;
  stock?: number;
  imagen?: string;
  activo?: boolean;
  categoriaId?: number;
}
