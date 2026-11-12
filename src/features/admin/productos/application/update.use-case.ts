import { IUpdate } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";
import { createSlug } from "@/src/commons/utils/helpers";

export class UpdateUseCase {
  constructor(private repo: ProductRepository) {}

  execute(data: Omit<IUpdate, "url">) {
    return this.repo.update({
      ...data,
      // Si cambia el título, regeneramos la url (slug)
      url: data.titulo ? createSlug(data.titulo) : undefined,
    });
  }
}
