import { prisma } from "@/src/commons/lib/prisma";
import { logger } from "@/src/commons/utils/logger";
import { User, ICreate, IUpdate } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";

// Campos que se devuelven: todos menos la contraseña
const userSelect = {
    id: true,
    nombre: true,
    apellido: true,
    email: true,
    rol: true,
    activo: true,
    fechaCreacion: true,
    fechaActualizacion: true,
};

// Único archivo de usuarios que habla con la base de datos (Prisma)
export class PrismaUserRepository implements UserRepository {

    async list(): Promise<User[] | boolean> {
        try {
            return await prisma.usuario.findMany({
                where: { activo: true }, // borrado lógico: los eliminados no se listan
                select: userSelect,
                orderBy: { id: "asc" },
            });
        } catch (error) {
            logger({ error: error as Error, module: "PrismaUserRepository.list" });
            return false;
        }
    }

    async getById(id: number): Promise<User | boolean> {
        try {
            const query = await prisma.usuario.findFirst({ where: { id, activo: true }, select: userSelect });
            return query ?? false;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaUserRepository.getById" });
            return false;
        }
    }

    async create(data: ICreate): Promise<boolean> {
        try {
            const query = await prisma.usuario.create({ data });
            return query?.id ? true : false;
        } catch (error) {
            // Por ejemplo: el email ya existe (es @unique en el schema)
            logger({ error: error as Error, module: "PrismaUserRepository.create" });
            return false;
        }
    }

    async update(data: IUpdate): Promise<boolean> {
        try {
            const { id, ...campos } = data;
            // activo: true -> no se puede editar un usuario eliminado
            await prisma.usuario.update({ where: { id, activo: true }, data: campos });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaUserRepository.update" });
            return false;
        }
    }

    // Borrado lógico: el usuario queda inactivo, no se borra la fila.
    // Cambiamos su email (@unique) para liberarlo: así ese correo se puede registrar de nuevo.
    async delete(id: number): Promise<boolean> {
        try {
            const usuario = await prisma.usuario.findFirst({ where: { id, activo: true }, select: { email: true } });
            if (!usuario) return false;

            await prisma.usuario.update({
                where: { id },
                data: { activo: false, email: `eliminado-${id}.${usuario.email}` },
            });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaUserRepository.delete" });
            return false;
        }
    }
}
