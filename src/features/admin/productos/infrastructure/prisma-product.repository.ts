import { prisma } from "@/src/commons/lib/prisma";
import { logger } from "@/src/commons/utils/logger";
import { Product, ProductList, ICreate, IUpdate } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";

// Único archivo de productos que habla con la base de datos (Prisma)
export class PrismaProductRepository implements ProductRepository {

    async list(): Promise<ProductList[] | boolean> {
        try {
            const query = await prisma.producto.findMany({
                // include trae también el nombre de la categoría (relación)
                include: { categoria: { select: { titulo: true } } },
                orderBy: { id: "asc" },
            });

            // Prisma devuelve los precios como Decimal; los pasamos a number
            return query.map((item) => ({
                ...item,
                precioCompra: Number(item.precioCompra),
                precioVenta: Number(item.precioVenta),
            }));
        } catch (error) {
            logger({ error: error as Error, module: "PrismaProductRepository.list" });
            return false;
        }
    }

    async getById(id: number): Promise<Product | boolean> {
        try {
            const query = await prisma.producto.findUnique({ where: { id } });

            if (!query) return false;

            return {
                ...query,
                precioCompra: Number(query.precioCompra),
                precioVenta: Number(query.precioVenta),
            };
        } catch (error) {
            logger({ error: error as Error, module: "PrismaProductRepository.getById" });
            return false;
        }
    }

    async create(data: ICreate): Promise<boolean> {
        try {
            const query = await prisma.producto.create({ data });
            return query?.id ? true : false;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaProductRepository.create" });
            return false;
        }
    }

    async update(data: IUpdate): Promise<boolean> {
        try {
            // Separamos el id (para el where) del resto de campos (para el data)
            const { id, ...campos } = data;
            await prisma.producto.update({ where: { id }, data: campos });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaProductRepository.update" });
            return false;
        }
    }

    // Borrado lógico: no se elimina la fila, solo se marca como inactiva
    async delete(id: number): Promise<boolean> {
        try {
            await prisma.producto.update({ where: { id }, data: { activo: false } });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: "PrismaProductRepository.delete" });
            return false;
        }
    }
}
