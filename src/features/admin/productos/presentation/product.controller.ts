import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { IRequestParams } from "@/src/utils/interfaces";
import { productContainer } from "../productos.container";
import { productoSchema, ProductoFormData } from "../schemas/productoSchema";
import { validateImage, isRealImage } from "@/src/commons/utils/image";

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
  categoriaId: form.categoriaId,
});

// En un FormData todo llega como texto. Convertimos a número los campos numéricos.
// Un campo vacío o que no vino queda como NaN, y Zod lo rechaza.
const toNumber = (value: FormDataEntryValue | null) =>
  value === null || value === "" ? NaN : Number(value);

// Arma el objeto que valida Zod a partir del FormData que manda el modal
const formDataToProduct = (formData: FormData) => ({
  categoriaId: toNumber(formData.get("categoriaId")),
  nombre: String(formData.get("nombre") ?? ""),
  descripcion: String(formData.get("descripcion") ?? ""),
  precioCompra: toNumber(formData.get("precioCompra")),
  precioVenta: toNumber(formData.get("precioVenta")),
  stock: toNumber(formData.get("stock")),
});

// Revisa la imagen: tipo (JPG/PNG), tamaño y que el contenido sea de verdad una imagen.
// Devuelve el mensaje de error, o null si está bien.
const checkImage = async (image: File) =>
  validateImage(image) ?? ((await isRealImage(image)) ? null : "El archivo no es una imagen JPG o PNG válida");

const unprocessable = (message: string) => NextResponse.json({ message }, { status: 422 });

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
    // El modal manda multipart/form-data (texto + archivo), no JSON
    const formData = await req.formData();
    const validation = productoSchema.safeParse(formDataToProduct(formData));

    if (!validation.success)
      return unprocessable(aroma.errors.unprocessableContent);

    // Al crear, la imagen es obligatoria
    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0)
      return unprocessable(aroma.errors.imageRequired);

    const imageError = await checkImage(image);
    if (imageError) return unprocessable(imageError);

    const status = await productContainer.createProduct.execute({
      ...toProductData(validation.data),
      image,
    });

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

    const formData = await req.formData();
    const validation = productoSchema.safeParse(formDataToProduct(formData));

    if (!validation.success)
      return unprocessable(aroma.errors.unprocessableContent);

    // Al editar, la imagen es opcional: solo se revisa si mandaron una nueva
    const image = formData.get("image");
    const hasImage = image instanceof File && image.size > 0;

    if (hasImage) {
      const imageError = await checkImage(image);
      if (imageError) return unprocessable(imageError);
    }

    const status = await productContainer.updateProduct.execute({
      id,
      ...toProductData(validation.data),
      image: hasImage ? image : undefined,
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
