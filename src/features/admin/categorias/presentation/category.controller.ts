import { aroma } from "@/src/utils/location";
import {NextResponse} from "next/server";
import { logger } from "@/src/commons/utils/logger";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);

const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

export async function listCategories() {
  try {
    return NextResponse.json({
      data: []
    });
  } catch (error) {
    logger({ error: toError(error), module: 'listCategories' });
    return serverError();
  }
}

export async function createCategory() {
  try {

  } catch (error) {
    logger({ error: toError(error), module: 'createCategory' });
    return serverError();
  }
}

export async function getCategoryById()
{
    try{

    }catch(error){
      logger({ error: toError(error), module: 'getCategoryById' });
      return serverError();
    }
}

export async function updateCategory() {
  try {
  } catch (error) {
    logger({ error: toError(error), module: 'updateCategory' });
    return serverError();
  }
}

export async function deleteCategory(id: number) {
  try {

  } catch (error) {
    logger({ error: toError(error), module: 'deleteCategory' });
    return serverError();
  }
}
