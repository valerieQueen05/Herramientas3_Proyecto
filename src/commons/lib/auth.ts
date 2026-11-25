import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/commons/lib/prisma";
import { logger } from "@/src/commons/utils/logger";
import { Rol } from "@/src/features/admin/usuarios/domain/user.entity";

export const SESSION_COOKIE_NAME = "aroma_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

export const DEFAULT_ADMIN_EMAIL =
  (process.env.DEFAULT_ADMIN_EMAIL ?? "admin@cafearoma.com").trim().toLowerCase();
export const DEFAULT_ADMIN_PASSWORD =
  process.env.DEFAULT_ADMIN_PASSWORD ?? "Admin123*";

const getSecret = () =>
  process.env.AUTH_SECRET ?? "cafe-aroma-session-secret-key-2026";

export interface SessionUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}

interface SessionPayload {
  userId: number;
  rol: Rol;
  exp: number;
}

const signPayload = (encodedPayload: string): string =>
  createHmac("sha256", getSecret()).update(encodedPayload).digest("base64url");

export const createSessionToken = (user: Pick<SessionUser, "id" | "rol">): string => {
  const payload: SessionPayload = {
    userId: user.id,
    rol: user.rol,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signPayload(encoded)}`;
};

export const verifySessionToken = (token: string): SessionPayload | null => {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = signPayload(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (!parsed.userId || !parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const isAdminRole = (rol: Rol): boolean => rol !== "CLIENTE";

export const getRedirectByRole = (rol: Rol): string =>
  isAdminRole(rol) ? "/admin/dashboard" : "/user/inicio";

export async function setSessionCookie(user: Pick<SessionUser, "id" | "rol">): Promise<void> {
  const token = createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Obtiene el usuario autenticado desde la cookie HTTP-only y valida que siga activo en la BD.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.usuario.findFirst({
      where: { id: payload.userId, activo: true },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        rol: true,
      },
    });

    return user ?? null;
  } catch (error) {
    logger({ error: error as Error, module: "getSessionUser" });
    return null;
  }
}

/**
 * Garantiza que exista un único usuario administrador por defecto si aún no hay ninguno activo.
 */
export async function ensureDefaultAdmin(): Promise<void> {
  try {
    const existingAdmin = await prisma.usuario.findFirst({
      where: { rol: "ADMINISTRADOR", activo: true },
      select: { id: true },
    });

    if (existingAdmin) return;

    const hash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    const byEmail = await prisma.usuario.findUnique({
      where: { email: DEFAULT_ADMIN_EMAIL },
      select: { id: true },
    });

    if (byEmail) {
      await prisma.usuario.update({
        where: { id: byEmail.id },
        data: {
          nombre: "Administrador",
          apellido: "Café Aroma",
          contrasena: hash,
          rol: "ADMINISTRADOR",
          activo: true,
        },
      });
      return;
    }

    await prisma.usuario.create({
      data: {
        nombre: "Administrador",
        apellido: "Café Aroma",
        email: DEFAULT_ADMIN_EMAIL,
        contrasena: hash,
        rol: "ADMINISTRADOR",
        activo: true,
      },
    });
  } catch (error) {
    logger({ error: error as Error, module: "ensureDefaultAdmin" });
  }
}

export async function requireAuth(): Promise<
  { user: SessionUser; response?: never } | { user?: never; response: NextResponse }
> {
  const user = await getSessionUser();
  if (!user) {
    return {
      response: NextResponse.json({ message: "No autorizado" }, { status: 401 }),
    };
  }
  return { user };
}

export async function requireAdmin(): Promise<
  { user: SessionUser; response?: never } | { user?: never; response: NextResponse }
> {
  const auth = await requireAuth();
  if (auth.response) return auth;
  if (!isAdminRole(auth.user.rol)) {
    return {
      response: NextResponse.json({ message: "Acceso restringido" }, { status: 403 }),
    };
  }
  return auth;
}
