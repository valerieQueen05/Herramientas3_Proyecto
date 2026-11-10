import { ICreate } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";
import { createSlug } from "@/src/commons/utils/helpers";

export class CreateUseCase {
    constructor(private repo: CategoryRepository) { }

    execute(name: string) {
        const data: ICreate = {
            titulo: name,
            url: createSlug(name),
        };
        return this.repo.create(data);
    }
}
