import React from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/src/commons/lib/auth";
import SidebarUsuario from "@/src/features/user/layout/components/SidebarUsuario";
import HeaderUsuario from "@/src/features/user/layout/components/HeaderUsuario";

export const dynamic = "force-dynamic";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarUsuario />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderUsuario user={user} />

        {/* ÁREA DINÁMICA: Aquí va el contenido de las páginas */}
        <main className="p-6 flex-1 overflow-y-auto text-[#16123f]">
          {children}
        </main>
      </div>
    </div>
  );
}
