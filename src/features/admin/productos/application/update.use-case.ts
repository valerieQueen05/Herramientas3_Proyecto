import { IUpdateInput } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";
import { createSlug, uploadImage, deleteImage } from "@/src/commons/utils/helpers";

export class UpdateUseCase {
  constructor(private repo: ProductRepository) {}

  async execute(data: IUpdateInput) {
    const { image, ...product } = data;

    // Solo subimos imagen si el usuario eligió una nueva
    let imageUrl: string | undefined;
    if (image) {
      const url = await uploadImage("products", image);
      if (!url) return false;
      imageUrl = url;
    }

    const status = await this.repo.update({
      ...product,
      // Si cambia el título, regeneramos la url (slug)
      url: product.titulo ? createSlug(product.titulo) : undefined,
      // undefined = Prisma no toca la columna: se conserva la imagen anterior
      imagen: imageUrl,
    });

    // Si la BD falló, borramos la imagen nueva para no dejarla huérfana
    if (!status && imageUrl) await deleteImage(imageUrl);

    return status;
  }
}
