import { ICreate } from "../domain/category.entity";
import { CategoryRepository } from "../domain/category.repository";

export class CreateUseCase {
    constructor(private repo: CategoryRepository) { }

    execute(name: string) {
        const url = name.trim().toLowerCase().replace(/\s+/g, '-');
        const data: ICreate = {
            titulo: name,
            url,
        };
        return this.repo.create(data);
    }
}