import { createSlug } from "@/src/commons/utils/helpers";
import { CategoryRepository } from "../domain/category.repository";
import { ICreate } from "../domain/category.entity";

export class DeleteUsecase {
    constructor(private repo: CategoryRepository) {}
    
        execute(id: number){
            const url = createSlug (data.titulo);
            const dataToUpdate: ICreate = {
                id: data.id,
                titulo: data.titulo,
                url,
                };
            

            return this.repo.delete(id);
        }
}