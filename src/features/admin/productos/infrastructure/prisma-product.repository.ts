import { logger } from "@/src/commons/utils/logger";
import { prisma } from "@/src/commons/lib/prisma";
import { ICreate, IUpdate } from "@/src/features/admin/productos/domain/product.entity";

export class PrismaProductRepository {
    async list(){
        try {
            const query = await prisma.producto.findMany({
                select: { 
                    id: true, 
                    titulo: true, 
                    url: true, 
                    fechaCreacion: true, 
                    activo: true , 
                    precioCompra: true, 
                    precioVenta: true, 
                    stock: true, 
                    imagen: true, 
                    categoriaId: true,
                    categoria: { select: { titulo: true } } },
            });

            return query.map((item) => ({
                ...item,
                // Decimal llega como objeto; NextResponse.json lo convertiría en string
                precioCompra: Number(item.precioCompra),
                precioVenta: Number(item.precioVenta),
                active: item.activo ? "Activo" : "Inactivo",
            }));
        }catch(error){
            logger({ error: error as Error, module: 'PrismaProductRepository.list'});
            return [];
        }
    }
    async getById(id: number){
        try {
            const query = await prisma.producto.findUnique({
                where: { id },
                include: { categoria: true },
            });
            return query;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaProductRepository.getById'});
            return null;
        }
    }
    async create(data: ICreate){
        try {
            const query = await prisma.producto.create({ data });
            return query;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaProductRepository.create'});
            return null;
        }
    }
    async update(data: IUpdate){
        try {
            const { id, ...updateData } = data;
            const query = await prisma.producto.update({
                where: { id },
                data: updateData,
            });
            return query;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaProductRepository.update'});
            return null;
        }
    }
    async delete(id: number){
        try {
            await prisma.producto.update({
                where: { id },
                data: { activo: false }
            });
            return true;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaProductRepository.delete'});
            return false;
        }
    }
}