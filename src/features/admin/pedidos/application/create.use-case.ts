import { ICreateOrderInput } from "../domain/order.entity";
import { OrderRepository } from "../domain/order.repository";

export class CreateOrderUseCase {
  constructor(private repo: OrderRepository) {}

  execute(data: ICreateOrderInput) {
    return this.repo.create(data);
  }
}
