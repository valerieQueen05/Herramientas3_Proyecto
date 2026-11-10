import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { categoriaSchema } from "../schemas/categoriaSchema";
import { categoryContainer } from "../category.container";
import { IRequestParams } from "@/src/utils/interfaces";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

// Lee el id de la URL (/api/category/5) y lo convierte a número.
// Devuelve null si no es un número válido.
const getIdFromParams = async (params: IRequestParams["params"]) => {
  const { id } = await params;
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
};

export async function listCategories() {
  try {
    const data = await categoryContainer.listCategories.execute();

    if (!data)
      return NextResponse.json({ error: aroma.errors.notFoundData }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: 'listCategories' });
    return serverError();
  }
}

export async function createCategory(req: Request) {
  try {
    const bodyData = await req.json();
    const validation = categoriaSchema.safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ error: aroma.errors.unprocessableContent }, { status: 422 });

    const status = await categoryContainer.createCategory.execute(validation.data.nombre);

    if (!status)
      return NextResponse.json({ message: aroma.errors.created }, { status: 500 });

    return NextResponse.json({ message: aroma.success.created }, { status: 201 });
  } catch (error) {
    logger({ error: toError(error), module: 'createCategory' });
    return serverError();
  }
}

export async function getCategoryById(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ error: aroma.errors.invalidId }, { status: 400 });

    const data = await categoryContainer.getCategoryById.execute(id);

    if (!data)
      return NextResponse.json({ error: aroma.errors.notFound }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: 'getCategoryById' });
    return serverError();
  }
}

export async function updateCategory(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ error: aroma.errors.invalidId }, { status: 400 });

    const bodyData = await req.json();
    const validation = categoriaSchema.safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ error: aroma.errors.unprocessableContent }, { status: 422 });

    // Traducimos los nombres del formulario (nombre, estado) a los de la BD (titulo, activo)
    const status = await categoryContainer.updateCategory.execute({
      id,
      titulo: validation.data.nombre,
      activo: validation.data.estado === "Activo",
    });

    if (!status)
      return NextResponse.json({ message: aroma.errors.updated }, { status: 500 });

    return NextResponse.json({ message: aroma.success.updated });
  } catch (error) {
    logger({ error: toError(error), module: 'updateCategory' });
    return serverError();
  }
}

export async function deleteCategory(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ error: aroma.errors.invalidId }, { status: 400 });

    const status = await categoryContainer.deleteCategory.execute(id);

    if (!status)
      return NextResponse.json({ message: aroma.errors.deleted }, { status: 500 });

    return NextResponse.json({ message: aroma.success.deleted });
  } catch (error) {
    logger({ error: toError(error), module: 'deleteCategory' });
    return serverError();
  }
}
