import { CategoryRepository } from "../domain/category.repository";

export class ListUseCase {
    constructor(private repo: CategoryRepository) {}

    execute(){
        return this.repo.list();
    }
}