import { ICreateInput } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";
import { createSlug, uploadImage, deleteImage } from "@/src/commons/utils/helpers";

export class CreateUseCase {
    constructor(private repo: ProductRepository) {}

    // 1. Sube la imagen a Vercel Blob  2. Genera la url (slug)  3. Guarda en la BD
    async execute(data: ICreateInput) {
        // Separamos el archivo del resto de los datos
        const { image, ...product } = data;

        const imageUrl = await uploadImage("products", image);

        // Si la imagen no se pudo subir, no creamos el producto
        if (!imageUrl) return false;

        const status = await this.repo.create({
            ...product,
            url: createSlug(product.titulo),
            imagen: imageUrl,
        });

        // Si la BD falló, borramos la imagen para no dejar archivos huérfanos en el blob
        if (!status) await deleteImage(imageUrl);

        return status;
    }
}
