import { PrismaCategoryRepository } from "./infrastructure/prisma-category.repository";
import { CreateUseCase } from "./application/create.use-case";


const repo = new PrismaCategoryRepository();

export const categoryContainer = {
    createCategory: new CreateUseCase(repo)
}