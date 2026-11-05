import { logger } from "@/src/commons/utils/logger";
import { prisma } from "@/src/commons/lib/prisma";
import { Category, ICreate, IUpdate } from "@/src/features/admin/categorias/domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";
import { validationSuite } from "@hookform/resolvers/vest/src/__tests__/__fixtures__/data.js";
import { IRequestParams } from "@/src/utils/interfaces";

export class PrismaCategoryRepository implements CategoryRepository{
    //modificado por el maestro
    async list(): Promise< Category [] | boolean>{
        try {
            const query = await prisma.categoria.findMany({
                select: { id: true, titulo: true, url: true, fechaCreacion: true, fechaActualizacion: true, activo: true },
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
    async getById(request : Request, { params }: IRequestParams): Promise<Category | boolean> {
        try {
            const { id } = params;
            const query = await prisma.categoria.findUnique({ where: {id} ,
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
                url: data.url
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
                where: { id: data.id },
                data: {
                    titulo: data.titulo,
                    url: data.url
                }
            });
        
        return query ? true : false;

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