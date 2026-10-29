import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { PrismaCategoryRepository } from "../infrastructure/prisma-category.repository";
import { IUpdate } from "../domain/category.entity";
import { categoriaSchema } from "../schemas/categoriaSchema";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);
const repo = new PrismaCategoryRepository();
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

export async function listCategories() {
  try {
    return NextResponse.json({
      data: await repo.list()
    });
  } catch (error) {
    logger({ error: toError(error), module: 'listCategories' });
    return serverError();
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

    return NextResponse.json({mensaje : true});
  } catch (error) {
    logger({ error: toError(error), module: 'createCategory' });
    return NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });
  }
}

export async function getCategoryById(id: number)
{
    try{
      return NextResponse.json({
        data: await repo.getById(id)
      });
    }catch(error){
      logger({ error: toError(error), module: 'getCategoryById' });
      return serverError();
    }
}

export async function updateCategory(data: IUpdate) {
  try {
    return NextResponse.json({
      data: await repo.update(data)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'updateCategory' });
    return serverError();
  }
}

export async function deleteCategory(id: number) {
  try {
    return NextResponse.json({
      data: await repo.delete(id)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'deleteCategory' });
    return serverError();
  }
}
