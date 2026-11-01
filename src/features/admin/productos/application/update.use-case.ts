import { IUpdate } from "../domain/product.entity";
import { ProductRepository } from "../domain/product.repository";

export class UpdateUseCase {
  constructor(private repo: ProductRepository) {}

  execute(data: IUpdate) {
    return this.repo.update(data);
  }
}