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
            const query = await prisma.usuario.findUnique({ where: { id }, select: userSelect });
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
            await prisma.usuario.update({ where: { id }, data: campos });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaUserRepository.update" });
            return false;
        }
    }

    // Borrado lógico: el usuario queda inactivo, no se borra la fila
    async delete(id: number): Promise<boolean> {
        try {
            await prisma.usuario.update({ where: { id }, data: { activo: false } });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaUserRepository.delete" });
            return false;
        }
    }
}
