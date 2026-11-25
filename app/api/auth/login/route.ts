import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/commons/lib/prisma";
import {
  ensureDefaultAdmin,
  getRedirectByRole,
  setSessionCookie,
} from "@/src/commons/lib/auth";
import { logger } from "@/src/commons/utils/logger";
import { loginSchema } from "@/src/features/auth/schemas/authSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 422 }
      );
    }

    // Asegura que exista un usuario administrador por defecto en el primer acceso
    await ensureDefaultAdmin();

    const email = validation.data.email.trim().toLowerCase();
    const usuario = await prisma.usuario.findFirst({
      where: { email, activo: true },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
        contrasena: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { message: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      validation.data.contrasena,
      usuario.contrasena
    );

    if (!validPassword) {
      return NextResponse.json(
        { message: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
    };

    await setSessionCookie(sessionUser);

    return NextResponse.json({
      message: "Inicio de sesión exitoso",
      user: sessionUser,
      redirectTo: getRedirectByRole(usuario.rol),
    });
  } catch (error) {
    logger({ error: error instanceof Error ? error : String(error), module: "auth.login" });
    return NextResponse.json(
      { message: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
