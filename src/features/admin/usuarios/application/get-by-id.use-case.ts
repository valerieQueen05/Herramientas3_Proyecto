import { UserRepository } from "../domain/user.repository";

export class GetByIdUseCase {
    constructor(private repo: UserRepository) {}

    execute(id: number){
        return this.repo.getById(id);
    }
}
