import { CategoryRepository } from "../domain/category.repository";
import { IUpdate } from "../domain/category.entity";

export class UpdateUseCase {
    constructor(private repo: CategoryRepository) {}
    
        execute(data: IUpdate){
            return this.repo.update(data);
        }
}