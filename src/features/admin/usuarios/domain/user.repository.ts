import { User, ICreate, IUpdate } from "./user.entity";

export interface UserRepository {
    list(): Promise<User[] | boolean>;
    create(data: ICreate): Promise<boolean>;
    getById(id: number): Promise<User | boolean>;
    update(data: IUpdate): Promise<boolean>;
    delete(id: number): Promise<boolean>;
}
