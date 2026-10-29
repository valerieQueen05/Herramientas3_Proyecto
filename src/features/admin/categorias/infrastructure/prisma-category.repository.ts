import { logger } from "@/src/commons/utils/logger";
import { prisma } from "@/src/commons/lib/prisma";
import { ICreate, IUpdate } from "@/src/features/admin/categorias/domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";

export class PrismaCategoryRepository implements CategoryRepository{
    async list(){
        try {
            const query = await prisma.categoria.findMany({
                select: { id: true, titulo: true, url: true, fechaCreacion: true, fechaActualizacion: true, activo: true },
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
            return query ?? false;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.getById'});
            return false;
        }
    }
    async create(data: ICreate){
        try {
            await prisma.categoria.create({ data });
            return true;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.create'});
            return false;
        }
    }
    async update(data: IUpdate){
        try {
            const { id, ...updateData } = data;
            await prisma.categoria.update({
                where: { id },
                data: updateData,
            });
            return true;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.update'});
            return false;
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