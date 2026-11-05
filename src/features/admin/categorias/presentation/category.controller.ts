import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { PrismaCategoryRepository } from "../infrastructure/prisma-category.repository";
import { IUpdate } from "../domain/category.entity";
import { categoriaSchema } from "../schemas/categoriaSchema";
import { categoryContainer } from "../category.container";
import { IRequestParams } from "@/src/utils/interfaces";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);
const repo = new PrismaCategoryRepository();
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

export async function listCategories() {
  try {
    
    const data = await categoryContainer.listCategories.execute();
    if(!data)
      //Agregado por el maestro (KOREAN LOVE)

    //No tenemos los Locations.ts o no se tienen el mismo nombre
      return NextResponse.json({error : aroma.errors.notFoundData});
      return NextResponse.json({data});
    
  } catch (error) {
    logger({ error: toError(error), module: 'listCategories' });
    return NextResponse.json({
      status: 500,
      menssage: aroma.errors.serverError
    });
  }
}

export async function createCategory(req: Request) {
  try {
    const bodyData = await req.json();

    const validation = categoriaSchema.safeParse(bodyData);

    console.log(" ----------- ");
    console.log(bodyData);
    console.log(" ----------- ");

    if (!validation.success)
      return NextResponse.json({ error: aroma.errors.unprocessableContent}, { status: 422})
      console.log(validation);
    //ver cuales son las incosistencias en esta parte que fue agregada por el maestro.
    const status = await categoryContainer.createCategory.execute(validation.data.nombre);

    console.log(status);

    return NextResponse.json({mensaje : status ? aroma.success.created : aroma.errors.created});
  } catch (error) {
    logger({ error: toError(error), module: 'createCategory' });
    return NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });
  }
}
//Terminar y poner correctamente el Params, desde el archivo de utils e interfaces, ahi hay que poner params, con la foto de valerie y terminar esta linea con la otra foto que le mande
export async function getCategoryById(req: Request, { params }: IRequestParams){
    try{
      const { id } = params;
      const Validation = categoriaSchema.safeParse(data);

      if (!Validation.success)
        return NextResponse.json({ error: aroma.errors.unprocessableContent }, { status: 422 });
      const data = {
        id: Number(id),
        titulo: Validation.data.nombre,
      }

      const status = await categoryContainer.getCategoryById.execute(data);


      return data ? NextResponse.json({data: data });

    }catch(error){
      logger({ error: toError(error), module: 'getCategoryById' });
      return NextResponse.json({
        status: 500,
        message: aroma.errors.serverError
      });
    }
}

export async function updateCategory(req: Request, { params }: IRequestParams) {
  try {
    //Modificado tambien.
    const { id } = params;
    const bodyData = await req.json();
    
    const validation = categoriaSchema.safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ error: aroma.errors.unprocessableContent }, { status: 422 });

    const data = {
      id: Number(id),
      titulo: validation.data.nombre,
    }

    const status = await categoryContainer.updateCategory.execute(data);

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: 'updateCategory' });
    return serverError();
  }
}

export async function deleteCategory(request: Request, { params }: IRequestParams) {
  try {
    const { id } = params;
    const validation = categoriaSchema.safeParse({ id: Number(id) });

    if (!validation.success)
      return NextResponse.json({ error: aroma.errors.unprocessableContent }, { status: 422 });

    const data = {
      id: Number(id),
    }
    return NextResponse.json({
      data: await repo.delete(id)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'deleteCategory' });
    return serverError();
  }
}
