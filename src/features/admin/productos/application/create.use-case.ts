import { ICreate } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";
import { createSlug } from "@/src/commons/utils/helpers";

export class CreateUseCase {
    constructor(private repo: ProductRepository) {}

    // Recibe todo menos la url; la url (slug) se genera aquí a partir del título
    execute(data: Omit<ICreate, "url">) {
        return this.repo.create({
            ...data,
            url: createSlug(data.titulo),
        });
    }
}
