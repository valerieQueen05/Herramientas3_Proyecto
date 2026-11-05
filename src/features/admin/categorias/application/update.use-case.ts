import { CategoryRepository } from "../domain/category.repository";
import { ICreate, IUpdate } from "../domain/category.entity";
import { createSlug } from "@/src/commons/utils/helpers";

export class UpdateUseCase {
    constructor(private repo: CategoryRepository) {}
    
        execute(data: IUpdate){
            const url = createSlug (data.titulo);
            const dataToUpdate: ICreate = {
                id: data.id,
                titulo: data.titulo,
                url,
                };




            return this.repo.update(dataToUpdate);
        }
}