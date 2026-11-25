"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import { Coffee } from "lucide-react";
import {
  PiHouse,
  PiUsersThree,
  PiSquaresFour,
  PiCoffee,
  PiClipboardText,
  PiReceipt,
  PiSignOut,
} from "react-icons/pi";
import { apiFetch } from "@/src/commons/utils/api";

interface INavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: INavItem[] = [
  { href: "/admin/dashboard", label: "Inicio", icon: <PiHouse size={18} /> },
  { href: "/admin/usuarios", label: "Usuarios", icon: <PiUsersThree size={18} /> },
  { href: "/admin/categorias", label: "Categorías", icon: <PiSquaresFour size={18} /> },
  { href: "/admin/productos", label: "Productos", icon: <PiCoffee size={18} /> },
  { href: "/admin/pedidos", label: "Pedidos", icon: <PiClipboardText size={18} /> },
  { href: "/admin/facturacion", label: "Facturación", icon: <PiReceipt size={18} /> },
];

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

interface INavbar {
  nombre?: string;
  rol?: string;
}

export default function Navbar({
  nombre: nombreDefault = "Administrador",
  rol: rolDefault = "Administrador",
}: INavbar) {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nombre: nombreDefault, rol: rolDefault });

  useEffect(() => {
    let activo = true;
    apiFetch<{ user: { nombre: string; apellido: string; rol: string } }>("/api/auth/me")
      .then((res) => {
        if (!activo) return;
        setUsuario({
          nombre: `${res.user.nombre} ${res.user.apellido}`.trim(),
          rol: capitalizar(res.user.rol),
        });
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-[#16123f] text-[#ffe26a]">
          <Coffee size={16} />
        </div>
        <span className="font-bold text-[#16123f]">Café Aroma</span>
      </div>

      {/* Navegación */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#16123f] text-white"
                  : "text-gray-500 hover:bg-gray-100 hover:text-[#16123f]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-[#16123f] transition-colors cursor-pointer"
        >
          <PiSignOut size={18} />
          Salir
        </button>
      </nav>

      {/* Usuario */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <Avatar.Fallback>
              {usuario.nombre
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </Avatar.Fallback>
          </Avatar>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-[#16123f]">{usuario.nombre}</p>
            <p className="text-xs text-gray-400">{usuario.rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
