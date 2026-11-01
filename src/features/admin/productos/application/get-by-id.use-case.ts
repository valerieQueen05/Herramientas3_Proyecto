import { ProductRepository } from "../domain/product.repository";

export class GetByIdUseCase {
  constructor(private repo: ProductRepository) {}

  execute(id: number) {
    return this.repo.getById(id);
  }
}