import { UserRepository } from "../domain/user.repository";

export class DeleteUseCase {
    constructor(private repo: UserRepository) {}

    execute(id: number) {
        return this.repo.delete(id);
    }
}
