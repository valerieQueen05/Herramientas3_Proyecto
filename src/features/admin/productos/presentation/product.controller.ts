import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { IRequestParams } from "@/src/utils/interfaces";
import { productContainer } from "../productos.container";
import { productoSchema, ProductoFormData } from "../schemas/productoSchema";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

// Lee el id de la URL (/api/product/5) y lo convierte a número.
// Devuelve null si no es un número válido.
const getIdFromParams = async (params: IRequestParams["params"]) => {
  const { id } = await params;
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
};

// Traducimos los nombres del formulario a los nombres de la BD
const toProductData = (form: ProductoFormData) => ({
  titulo: form.nombre,
  descripcion: form.descripcion,
  precioCompra: form.precioCompra,
  precioVenta: form.precioVenta,
  stock: form.stock,
  imagen: form.emoji,
  activo: form.estado === "Activo",
  categoriaId: form.categoriaId,
});

export async function listProducts() {
  try {
    const data = await productContainer.listProducts.execute();

    if (!data)
      return NextResponse.json({ message: aroma.errors.notFoundData }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "listProducts" });
    return serverError();
  }
}

export async function createProduct(req: Request) {
  try {
    const bodyData = await req.json();
    const validation = productoSchema.safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ message: aroma.errors.unprocessableContent }, { status: 422 });

    const status = await productContainer.createProduct.execute(toProductData(validation.data));

    if (!status)
      return NextResponse.json({ message: aroma.errors.created }, { status: 500 });

    return NextResponse.json({ message: aroma.success.created }, { status: 201 });
  } catch (error) {
    logger({ error: toError(error), module: "createProduct" });
    return serverError();
  }
}

export async function getProductById(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });

    const data = await productContainer.getProductById.execute(id);

    if (!data)
      return NextResponse.json({ message: aroma.errors.notFound }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "getProductById" });
    return serverError();
  }
}

export async function updateProduct(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });

    const bodyData = await req.json();
    const validation = productoSchema.safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ message: aroma.errors.unprocessableContent }, { status: 422 });

    const status = await productContainer.updateProduct.execute({
      id,
      ...toProductData(validation.data),
    });

    if (!status)
      return NextResponse.json({ message: aroma.errors.updated }, { status: 500 });

    return NextResponse.json({ message: aroma.success.updated });
  } catch (error) {
    logger({ error: toError(error), module: "updateProduct" });
    return serverError();
  }
}

export async function deleteProduct(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });

    const status = await productContainer.deleteProduct.execute(id);

    if (!status)
      return NextResponse.json({ message: aroma.errors.deleted }, { status: 500 });

    return NextResponse.json({ message: aroma.success.deleted });
  } catch (error) {
    logger({ error: toError(error), module: "deleteProduct" });
    return serverError();
  }
}
