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
}

export interface IUpdate {
  id: number;
  titulo?: string;
  url?: string;
  activo?: boolean;
}