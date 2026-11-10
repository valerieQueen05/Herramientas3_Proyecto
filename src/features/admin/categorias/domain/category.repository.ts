import { Category, CategoryList, ICreate, IUpdate } from "./category.entity";

export interface CategoryRepository {
    list(): Promise<CategoryList[] | boolean>;
    create(data: ICreate): Promise<boolean>;
    getById(id: number) : Promise<Category | boolean>;
    update(data: IUpdate): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}