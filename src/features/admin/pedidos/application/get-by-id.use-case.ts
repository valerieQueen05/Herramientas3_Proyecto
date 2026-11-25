import { OrderRepository } from "../domain/order.repository";

export class GetOrderByIdUseCase {
  constructor(private repo: OrderRepository) {}

  execute(id: number) {
    return this.repo.getById(id);
  }
}
