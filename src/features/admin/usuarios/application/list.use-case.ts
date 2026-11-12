import { UserRepository } from "../domain/user.repository";

export class ListUseCase {
    constructor(private repo: UserRepository) {}

    execute(){
        return this.repo.list();
    }
}