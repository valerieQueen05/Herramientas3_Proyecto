import { ProductRepository } from "../domain/product.repository";

export class DeleteUseCase {
  constructor(private repo: ProductRepository) {}

  execute(id: number) {
    return this.repo.delete(id);
  }
}