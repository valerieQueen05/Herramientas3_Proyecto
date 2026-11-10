import { CategoryRepository } from "../domain/category.repository";
import { IUpdate } from "../domain/category.entity";
import { createSlug } from "@/src/commons/utils/helpers";

export class UpdateUseCase {
    constructor(private repo: CategoryRepository) {}

    execute(data: Omit<IUpdate, "url">) {
        const dataToUpdate: IUpdate = {
            ...data,
            // Si cambia el título, regeneramos la url (slug)
            url: data.titulo ? createSlug(data.titulo) : undefined,
        };

        return this.repo.update(dataToUpdate);
    }
}
