"use client"; // Necesario para leer la ruta actual en el navegador

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, LayoutGrid, ShoppingBag, ClipboardList, Bell, LogOut } from "lucide-react";

export default function SidebarUsuario() {
  const pathname = usePathname(); // Obtenemos la URL actual (ej: "/user/notificaciones")

  // Función que decide los colores si la ruta actual coincide con el botón
  const linkStyles = (path: string) =>
    pathname === path
      ? "bg-white text-[#16123f] shadow-sm" // Estilo Activo (blanco sobre navy = máximo contraste)
      : "text-white/60 hover:text-white hover:bg-white/10"; // Estilo Inactivo

  return (
    <aside className="w-64 p-6 flex flex-col justify-between md:flex min-h-screen bg-[#16123f] rounded-r-4xl">
      <div>
        <div className="flex items-center gap-3 mb-12 mt-2">
          <div className="bg-[#16123f] text-[white] p-2 rounded-xl">
            <Coffee size={24} />
          </div>
          <span className="font-bold text-xl text-white">Café Aroma</span>
        </div>

        <nav className="flex flex-col gap-3 font-medium text-sm">
          <Link href="/user/inicio" className={`px-4 py-3.5 rounded-2xl flex items-center gap-4 transition-colors ${linkStyles('/user/inicio')}`}>
            <LayoutGrid size={20} />
            <span>Inicio</span>
          </Link>

          <Link href="/user/solicitar" className={`px-4 py-3.5 rounded-2xl flex items-center gap-4 transition-colors ${linkStyles('/user/solicitar')}`}>
            <ShoppingBag size={20} />
            <span>Solicitar</span>
          </Link>

          <Link href="/user/pedidos" className={`px-4 py-3.5 rounded-2xl flex items-center gap-4 transition-colors ${linkStyles('/user/pedidos')}`}>
            <ClipboardList size={20} />
            <span>Últimos pedidos</span>
          </Link>

          <Link href="/user/notificaciones" className={`px-4 py-3.5 rounded-2xl flex items-center justify-between transition-colors ${linkStyles('/user/notificaciones')}`}>
            <div className="flex items-center gap-4">
              <Bell size={20} />
              <span>Notificaciones</span>
            </div>
            <span className="bg-[#75c9b7] text-[#16123f] text-[10px] font-bold px-2 py-0.5 rounded-full">
              2
            </span>
          </Link>
        </nav>
      </div>

      <Link href="/" className="text-white/60 hover:text-white flex items-center gap-4 font-medium transition-colors mb-4 px-4 pt-4 border-t border-white/10">
        <LogOut size={20} />
        <span>Cerrar sesión</span>
      </Link>
    </aside>
  );
}