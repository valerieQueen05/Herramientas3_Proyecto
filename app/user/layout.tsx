import React from "react";
import SidebarUsuario from "@/componentes/SidebarUsuario";
import HeaderUsuario from "@/componentes/HeaderUsuario";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#c7ddcc]">
      
      {/* Insertamos nuestro nuevo componente Sidebar */}
      <SidebarUsuario />

      <div className="flex-1 flex flex-col">
        
        {/* Insertamos nuestro nuevo componente Header */}
        <HeaderUsuario />

        {/* ÁREA DINÁMICA: Aquí va el contenido de las páginas */}
        <main className="p-6 flex-1 overflow-y-auto text-[#16123f]">
          {children}
        </main>

      </div>
    </div>
  );
}