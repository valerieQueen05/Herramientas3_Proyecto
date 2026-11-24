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

// Lo que recibe el caso de uso de CREAR: no trae url (se genera) ni imagen (URL),
// sino el archivo de la imagen, que el caso de uso sube a Vercel Blob
export type ICreateInput = Omit<ICreate, "url" | "imagen"> & { image: File };

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

// Lo que recibe el caso de uso de EDITAR: la imagen es opcional
// (si no viene, el producto conserva la que tenía)
export type IUpdateInput = Omit<IUpdate, "url" | "imagen"> & { image?: File };
