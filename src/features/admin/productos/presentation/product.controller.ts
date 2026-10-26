import { aroma } from "@/src/utils/location";
import {NextResponse} from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { PrismaProductRepository } from "../infrastructure/prisma-product.repository";
import { ICreate, IUpdate } from "../domain/product.entity";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);
const repo = new PrismaProductRepository();
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

export async function listProducts() {
  try {
    return NextResponse.json({
      data: await repo.list()
    });
  } catch (error) {
    logger({ error: toError(error), module: 'listProducts' });
    return serverError();
  }
}

export async function createProduct(data: ICreate) {
  try {
    return NextResponse.json({
      data: await repo.create(data)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'createProduct' });
    return serverError();
  }
}

export async function getProductById(id: number)
{
    try{

    }catch(error){
      logger({ error: toError(error), module: 'getProductById' });
      return serverError();
    }
}

export async function updateProduct(data: IUpdate) {
  try {
    return NextResponse.json({
      data: await repo.update(data)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'updateProduct' });
    return serverError();
  }
}

export async function deleteProduct(id: number) {
  try {
    return NextResponse.json({
      data: await repo.delete(id)
    });
  } catch (error) {
    logger({ error: toError(error), module: 'deleteProduct' });
    return serverError();
  }
}
