import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/src/commons/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ message: "Sesión cerrada correctamente" });
}
