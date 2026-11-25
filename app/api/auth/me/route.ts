import { NextResponse } from "next/server";
import { getSessionUser } from "@/src/commons/lib/auth";

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
