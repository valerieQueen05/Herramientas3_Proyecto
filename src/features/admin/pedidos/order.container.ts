import { PrismaOrderRepository } from "./infrastructure/prisma-order.repository";
import { ListOrdersUseCase } from "./application/list.use-case";
import { GetOrderByIdUseCase } from "./application/get-by-id.use-case";
import { CreateOrderUseCase } from "./application/create.use-case";
import { UpdateOrderStatusUseCase } from "./application/update-status.use-case";

const repository = new PrismaOrderRepository();

export const orderContainer = {
  listOrders: new ListOrdersUseCase(repository),
  getOrderById: new GetOrderByIdUseCase(repository),
  createOrder: new CreateOrderUseCase(repository),
  updateOrderStatus: new UpdateOrderStatusUseCase(repository),
};
