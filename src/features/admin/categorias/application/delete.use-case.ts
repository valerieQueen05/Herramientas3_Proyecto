import { CategoryRepository } from "../domain/category.repository";

export class DeleteUsecase {
    constructor(private repo: CategoryRepository) {}
    
        execute(id: number){
            return this.repo.delete(id);
        }
}