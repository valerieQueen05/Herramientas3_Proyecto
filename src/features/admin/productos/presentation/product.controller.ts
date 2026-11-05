import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { PrismaProductRepository } from "../infrastructure/prisma-product.repository";
import { IUpdate } from "../domain/product.entity";
import {prisma} from "@/src/commons/lib/prisma";


import { productContainer } from "../productos.container";
import { productoSchema } from "../schemas/productoSchema";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);

// Mantenemos esto para que las funciones viejas (list, update, delete) sigan funcionando por ahora
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

export async function createProduct(req: Request) {
  try {
    const bodyData = await req.json();
    const validation = productoSchema.safeParse(bodyData);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues },
        { status: 422 }
      );
    }

    const formData = validation.data;

    // El formulario envía el nombre de la categoría, pero el producto necesita su ID.
    const categoria = await prisma.categoria.findFirst({
      where: {
        titulo: formData.categoria,
        activo: true,
      },
      select: { id: true },
    });

    if (!categoria) {
      return NextResponse.json(
        { error: "La categoría seleccionada no existe o está inactiva" },
        { status: 422 }
      );
    }

    const datosProducto = {
      titulo: formData.nombre,
      descripcion: formData.descripcion,
      precioCompra: formData.precio,
      precioVenta: formData.precio,
      stock: formData.stock,
      imagen: formData.emoji,
      categoriaId: categoria.id,
    };

    // Una sola llamada, con los nombres de campos que espera el caso de uso.
    const result = await productContainer.createProduct.execute(datosProducto);

    if (!result) {
      return serverError();
    }

    return NextResponse.json({ mensaje: true });
  } catch (error) {
    logger({ error: toError(error), module: "createProduct" });
    return serverError();
  }
}

export async function getProductById(id: number) {
    try {
      return NextResponse.json({
        data: await repo.getById(id)
      });
    } catch(error) {
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