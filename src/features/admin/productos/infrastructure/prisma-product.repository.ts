// Importamos la conexión real a Prisma y el logger para errores
import { prisma } from "@/src/commons/lib/prisma";
import { logger } from "@/src/commons/utils/logger";

// Importamos el contrato y las interfaces
import { ICreate, IUpdate } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";

// Le agregamos "implements ProductRepository" para obligarlo a cumplir el contrato
export class PrismaProductRepository implements ProductRepository {
    
   async list() {
        try {
            // Hacemos la consulta a Prisma
            const query = await prisma.producto.findMany();
            
            // Convertimos los Decimal a number normal de TypeScript para cumplir el contrato
            return query.map((item) => ({
                ...item,
                precioCompra: Number(item.precioCompra),
                precioVenta: Number(item.precioVenta),
            }));
            
        } catch (error) {
            logger({ error: error as Error, module: 'PrismaProductRepository.list' });
            return false;
        }
    }

    async getById(id: number) {
        try {
            const query = await prisma.producto.findUnique({ where: { id } });
            
            // Si es null (no lo encontró), devuelve false
            if (!query) return false;

            // Si lo encontró, convertimos los Decimal a number antes de retornarlo
            return {
                ...query,
                precioCompra: Number(query.precioCompra),
                precioVenta: Number(query.precioVenta),
            };
            
        } catch (error) {
            logger({ error: error as Error, module: 'PrismaProductRepository.getById' });
            return false;
        }
    }

    async create(data: ICreate) {
        try {
            await prisma.producto.create({ data });
            return true; // Retornamos true indicando que se guardó con éxito
        } catch (error) {
            logger({ error: error as Error, module: 'PrismaProductRepository.create' });
            return false; // Retornamos false si hubo un problema
        }
    }

    async update(data: IUpdate) {
        try {
            const { id, ...updateData } = data;
            await prisma.producto.update({
                where: { id },
                data: updateData,
            });
            return true;
        } catch (error) {
            logger({ error: error as Error, module: 'PrismaProductRepository.update' });
            return false;
        }
    }

    async delete(id: number) {
  try {
    await prisma.producto.update({
      where: { id },
      data: { activo: false },
    });

    return true;
  } catch (error) {
    logger({ error: error as Error, module: "PrismaProductRepository.delete" });
    return false;
   }
 }
}