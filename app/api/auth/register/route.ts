import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/commons/lib/prisma";
import { setSessionCookie } from "@/src/commons/lib/auth";
import { logger } from "@/src/commons/utils/logger";
import { registerSchema } from "@/src/features/auth/schemas/authSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0]?.message ?? "Datos inválidos" },
        { status: 422 }
      );
    }

    const email = validation.data.email.trim().toLowerCase();
    const existente = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existente) {
      return NextResponse.json(
        { message: "Ya existe una cuenta registrada con este correo" },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(validation.data.contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: validation.data.nombre.trim(),
        apellido: validation.data.apellido.trim(),
        email,
        contrasena: hash,
        rol: "CLIENTE",
        activo: true,
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
    });

    await setSessionCookie(nuevoUsuario);

    return NextResponse.json(
      {
        message: "Cuenta creada correctamente",
        user: nuevoUsuario,
        redirectTo: "/user/inicio",
      },
      { status: 201 }
    );
  } catch (error) {
    logger({ error: error instanceof Error ? error : String(error), module: "auth.register" });
    return NextResponse.json(
      { message: "Error al crear la cuenta" },
      { status: 500 }
    );
  }
}
