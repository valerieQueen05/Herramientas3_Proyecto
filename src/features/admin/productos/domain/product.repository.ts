import { Product, ICreate, IUpdate } from "./product.entity";

export interface ProductRepository {
    list(): Promise<Product[] | boolean>;
    create(data: ICreate): Promise<boolean>;
    getById(id: number): Promise<Product | boolean>;
    update(data: IUpdate): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}