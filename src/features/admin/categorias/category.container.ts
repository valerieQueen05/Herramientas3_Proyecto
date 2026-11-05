import { PrismaCategoryRepository } from "./infrastructure/prisma-category.repository";
import { CreateUseCase } from "./application/create.use-case";
import {ListUseCase} from "./application/list.use-case";
import { GetByIdUseCase } from "./application/get-by-id.use-case";
import { DeleteUseCase } from "../productos/application/delete.use-case";
import { UpdateUseCase } from "./application/update.use-case";

const repo = new PrismaCategoryRepository();

export const categoryContainer = {
    createCategory: new CreateUseCase(repo),
    listCategories: new ListUseCase(repo),
    getCategoryById: new GetByIdUseCase(repo),
    updateCategory: new UpdateUseCase(repo),
    deleteCategory: new DeleteUseCase(repo)
}