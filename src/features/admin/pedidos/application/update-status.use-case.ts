import { IUpdateOrderStatusInput } from "../domain/order.entity";
import { OrderRepository } from "../domain/order.repository";

export class UpdateOrderStatusUseCase {
  constructor(private repo: OrderRepository) {}

  execute(data: IUpdateOrderStatusInput) {
    return this.repo.updateStatus(data);
  }
}
