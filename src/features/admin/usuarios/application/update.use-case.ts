import bcrypt from "bcryptjs";
import { IUpdate } from "../domain/user.entity";
import { UserRepository } from "../domain/user.repository";

export class UpdateUseCase {
    constructor(private repo: UserRepository) {}

    // Si viene una contraseña nueva se guarda su hash; si no viene, no se toca
    async execute(data: IUpdate) {
        const contrasena = data.contrasena ? await bcrypt.hash(data.contrasena, 10) : undefined;
        return this.repo.update({ ...data, contrasena });
    }
}
