import { Category, ICreate, IUpdate } from "./category.entity";

export interface CategoryRepository {
    list(): Promise<Category[] | boolean>;
    create(data: ICreate): Promise<boolean>;
    getById(id: number) : Promise<Category | boolean>;
    update(data: IUpdate): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}