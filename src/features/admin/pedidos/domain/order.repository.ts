import {
  ICreateOrderInput,
  IListOrdersFilter,
  IUpdateOrderStatusInput,
  Order,
  OrderActionResult,
} from "./order.entity";

export interface OrderRepository {
  list(filter?: IListOrdersFilter): Promise<Order[] | false>;
  getById(id: number): Promise<Order | false>;
  create(data: ICreateOrderInput): Promise<OrderActionResult<{ id: number }>>;
  updateStatus(data: IUpdateOrderStatusInput): Promise<OrderActionResult>;
}
