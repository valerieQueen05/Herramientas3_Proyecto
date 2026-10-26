import { aroma } from "@/src/utils/location";
import {NextResponse} from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { PrismaCategoryRepository } from "../infrastructure/prisma-category.repository";
import { ICreate, IUpdate } from "../domain/category.entity";

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

export async function createCategory(data: ICreate) {
  try {
    return NextResponse.json({
      data: await repo.create(data)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'createCategory' });
    return serverError();
  }
}

export async function getCategoryById(id: number)
{
    try{

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
