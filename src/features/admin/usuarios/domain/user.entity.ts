// Los mismos valores del enum Rol de prisma/schema.prisma
export type Rol = "ADMINISTRADOR" | "ADMINISTRATIVO" | "MENSAJERO" | "CLIENTE";

// Ojo: el usuario que devolvemos NUNCA lleva la contraseña
export type User = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
};

export interface ICreate {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string; // aquí ya llega el hash, no la contraseña real
  rol: Rol;
  activo?: boolean;
}

export interface IUpdate {
  id: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  contrasena?: string;
  rol?: Rol;
  activo?: boolean;
}
