import { IListOrdersFilter } from "../domain/order.entity";
import { OrderRepository } from "../domain/order.repository";

export class ListOrdersUseCase {
  constructor(private repo: OrderRepository) {}

  execute(filter?: IListOrdersFilter) {
    return this.repo.list(filter);
  }
}
