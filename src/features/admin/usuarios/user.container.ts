import { PrismaUserRepository } from "./infrastructure/prisma-user.repository";
import { CreateUseCase } from "./application/create.use-case";
import { ListUseCase } from "./application/list.use-case";
import { GetByIdUseCase } from "./application/get-by-id.use-case";
import { UpdateUseCase } from "./application/update.use-case";
import { DeleteUseCase } from "./application/delete.use-case";

const repo = new PrismaUserRepository();

export const userContainer = {
    createUser: new CreateUseCase(repo),
    listUsers: new ListUseCase(repo),
    getUserById: new GetByIdUseCase(repo),
    updateUser: new UpdateUseCase(repo),
    deleteUser: new DeleteUseCase(repo),
};
