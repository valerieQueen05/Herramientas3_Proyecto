import { logger } from "@/src/commons/utils/logger";
import { prisma } from "@/src/commons/lib/prisma";
import { ICreate, IUpdate } from "@/src/features/admin/categorias/domain/category.entity";

export class PrismaCategoryRepository {
    async list(){
        try {
            const query = await prisma.categoria.findMany({
                select: { id: true, titulo: true, url: true, fechaCreacion: true, activo: true },
            });
            return query.map((item) => ({
                ...item,
                active: item.activo ? "Activo" : "Inactivo",
            }));
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.list'});
            return [];
        }
    }
    async getById(id: number){
        try {
            const query = await prisma.categoria.findUnique({ where: {id} });
            return query;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.getById'});
            return null;
        }
    }
    async create(data: ICreate){
        try {
            const query = await prisma.categoria.create({ data });
            return query;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.create'});
            return null;
        }
    }
    async update(data: IUpdate){
        try {
            const { id, ...updateData } = data;
            const query = await prisma.categoria.update({
                where: { id },
                data: updateData,
            });
            return query;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.update'});
            return null;
        }
    }
    async delete(id: number){
        try {
            await prisma.categoria.update({
                where: { id },
                data: { activo: false }
            });

            return true;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.delete'});
            return false;
        }
    }
}