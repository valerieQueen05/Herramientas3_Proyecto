import { logger } from "@/src/commons/utils/logger";
import { prisma } from "@/src/commons/lib/prisma";
import { Category, CategoryList, ICreate, IUpdate } from "@/src/features/admin/categorias/domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";

export class PrismaCategoryRepository implements CategoryRepository{
    //modificado por el maestro
    async list(): Promise<CategoryList[] | boolean>{
        try {
            const query = await prisma.categoria.findMany({
                where: { activo: true }, // borrado lógico: los eliminados no se listan
                select: { id: true, titulo: true, url: true, fechaCreacion: true, fechaActualizacion: true, activo: true },
                orderBy: { id: "asc" },
            });
            //Modificado por el maestro(KOREAN LOVE)
            const data = query.map((item) => ({
                ...item,
                fechaCreacion: item.fechaCreacion.toISOString(),
                fechaActualizacion: item.fechaActualizacion.toISOString(),

                // ...item,
                //id: item.id,
                //name: item.name,
                //url.item.url,
                //active: item.activo ? "Activo" : "Inactivo",
                //createAt: item.created_at
               
            //Hasta aqui... (KOREAN LOVE)
            }));
            return data;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.list'});
            return [];
        }
    }
    // El repositorio solo recibe el id; el Request y los params se manejan en el controller
    async getById(id: number): Promise<Category | boolean> {
        try {
            const query = await prisma.categoria.findFirst({ where: { id, activo: true } ,
            select: 
            { id: true,
                 titulo: true, 
                 url: true, 
                 fechaCreacion: true,
                 fechaActualizacion: true, 
                 activo: true 
                }});
            
        return query ?? false;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.getById'});
            return false;
        }
    }
    async create(data: ICreate) : Promise<boolean> {
        try {
            //Parte agregada por el maestro en la clase de 3 de noviembre, revisar
          const query = await prisma.categoria.create ({
            data: {
                titulo: data.titulo,
                url: data.url,
            }
          });
            return query?.id ? true : false;

        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.create'});
            return false;
        }
    }
    async update(data: IUpdate): Promise<boolean> {
        try {
            const query = await prisma.categoria.update({
                where: { id: data.id, activo: true }, // no se puede editar una categoría eliminada
                data: {
                    titulo: data.titulo,
                    url: data.url,
                }
            });
        
        return query ? true : false;

        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.update'});
            return false;
        }
    }
    // Borrado lógico: la categoría queda inactiva. Cambiamos su url (@unique)
    // para liberarla y poder crear otra categoría con el mismo nombre.
    async delete(id: number){
        try {
            const categoria = await prisma.categoria.findFirst({ where: { id, activo: true }, select: { url: true } });
            if (!categoria) return false;

            await prisma.categoria.update({
                where: { id },
                data: { activo: false, url: `${categoria.url}-eliminado-${id}` }
            });

            return true;
        }catch(error){
            logger({ error: error as Error, module: 'PrismaCategoryRepository.delete'});
            return false;
        }
    }
}