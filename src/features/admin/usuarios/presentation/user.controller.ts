import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { IRequestParams } from "@/src/utils/interfaces";
import { userContainer } from "../user.container";
import { crearUsuarioSchema, UsuarioFormData } from "../schemas/usuarioSchema";
import { Rol } from "../domain/user.entity";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

// Lee el id de la URL (/api/user/5) y lo convierte a número.
// Devuelve null si no es un número válido.
const getIdFromParams = async (params: IRequestParams["params"]) => {
  const { id } = await params;
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
};

// Traducimos los nombres del formulario a los de la BD.
// "Administrador" -> "ADMINISTRADOR" (así está el enum Rol en el schema de Prisma)
const toUserData = (form: UsuarioFormData) => ({
  nombre: form.nombre,
  apellido: form.apellido,
  email: form.email,
  rol: form.rol.toUpperCase() as Rol,
  activo: form.estado === "Activo",
});

export async function listUsers() {
  try {
    const data = await userContainer.listUsers.execute();

    if (!data)
      return NextResponse.json({ message: aroma.errors.notFoundData }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "listUsers" });
    return serverError();
  }
}

export async function createUser(req: Request) {
  try {
    const bodyData = await req.json();
    // false = estamos creando, la contraseña es obligatoria
    const validation = crearUsuarioSchema(false).safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ message: aroma.errors.unprocessableContent }, { status: 422 });

    const status = await userContainer.createUser.execute({
      ...toUserData(validation.data),
      contrasena: validation.data.contrasena,
    });

    if (!status)
      return NextResponse.json({ message: aroma.errors.created }, { status: 500 });

    return NextResponse.json({ message: aroma.success.created }, { status: 201 });
  } catch (error) {
    logger({ error: toError(error), module: "createUser" });
    return serverError();
  }
}

export async function getUserById(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });

    const data = await userContainer.getUserById.execute(id);

    if (!data)
      return NextResponse.json({ message: aroma.errors.notFound }, { status: 404 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "getUserById" });
    return serverError();
  }
}

export async function updateUser(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });

    const bodyData = await req.json();
    // true = estamos editando, la contraseña puede ir vacía (no se cambia)
    const validation = crearUsuarioSchema(true).safeParse(bodyData);

    if (!validation.success)
      return NextResponse.json({ message: aroma.errors.unprocessableContent }, { status: 422 });

    const status = await userContainer.updateUser.execute({
      id,
      ...toUserData(validation.data),
      contrasena: validation.data.contrasena || undefined,
    });

    if (!status)
      return NextResponse.json({ message: aroma.errors.updated }, { status: 500 });

    return NextResponse.json({ message: aroma.success.updated });
  } catch (error) {
    logger({ error: toError(error), module: "updateUser" });
    return serverError();
  }
}

export async function deleteUser(req: Request, { params }: IRequestParams) {
  try {
    const id = await getIdFromParams(params);

    if (!id)
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });

    const status = await userContainer.deleteUser.execute(id);

    if (!status)
      return NextResponse.json({ message: aroma.errors.deleted }, { status: 500 });

    return NextResponse.json({ message: aroma.success.deleted });
  } catch (error) {
    logger({ error: toError(error), module: "deleteUser" });
    return serverError();
  }
}
