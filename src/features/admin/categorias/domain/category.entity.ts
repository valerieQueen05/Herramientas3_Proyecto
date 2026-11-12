export type Category = {
  id: number;
  titulo: string;
  url: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export interface ICreate {
  titulo: string;
  url: string;
  activo?: boolean;
}

export interface IUpdate {
  id: number;
  titulo?: string;
  url?: string;
  activo?: boolean;
}

// Lo que devuelve el listado: las fechas ya convertidas a texto (ISO)
export type CategoryList = Omit<Category, "fechaCreacion" | "fechaActualizacion"> & {
  fechaCreacion: string;
  fechaActualizacion: string;
};
