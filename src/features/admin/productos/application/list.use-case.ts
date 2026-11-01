import { ProductRepository } from "../domain/product.repository";

export class ListUseCase {
  constructor(private repo: ProductRepository) {}

  execute() {
    return this.repo.list();
  }
}