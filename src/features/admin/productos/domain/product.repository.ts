import { Product, ProductList, ICreate, IUpdate } from "./product.entity";

export interface ProductRepository {
    list(): Promise<ProductList[] | boolean>;
    create(data: ICreate): Promise<boolean>;
    getById(id: number): Promise<Product | boolean>;
    update(data: IUpdate): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
