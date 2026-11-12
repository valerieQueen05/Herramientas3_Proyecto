import bcrypt from "bcryptjs";
import { ICreate } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";

export class CreateUseCase {
    constructor(private repo: UserRepository) {}

    // Recibe la contraseña real y guarda solo su hash
    async execute(data: ICreate) {
        const hash = await bcrypt.hash(data.contrasena, 10);
        return this.repo.create({ ...data, contrasena: hash });
    }
}
