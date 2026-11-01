import { CreateUseCase } from "./application/create.use-case";
import { DeleteUseCase } from "./application/delete.use-case";
import { GetByIdUseCase } from "./application/get-by-id.use-case";
import { ListUseCase } from "./application/list.use-case";
import { UpdateUseCase } from "./application/update.use-case";
import { PrismaProductRepository } from "./infrastructure/prisma-product.repository";

const repo = new PrismaProductRepository();

export const productContainer = {
  createProduct: new CreateUseCase(repo),
  listProducts: new ListUseCase(repo),
  getProductById: new GetByIdUseCase(repo),
  updateProduct: new UpdateUseCase(repo),
  deleteProduct: new DeleteUseCase(repo),
};