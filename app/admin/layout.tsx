import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser, isAdminRole } from "@/src/commons/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  if (!isAdminRole(user.rol)) {
    redirect("/user/inicio");
  }

  return <>{children}</>;
}
