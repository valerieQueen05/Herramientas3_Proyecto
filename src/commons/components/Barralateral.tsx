"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@heroui/react";
import { TfiCup } from "react-icons/tfi";
import {Coffee} from "lucide-react";
import {
  PiHouse,
  PiUsersThree,
  PiSquaresFour,
  PiCoffee,
  PiClipboardText,
  PiReceipt,
  PiSignOut,
} from "react-icons/pi";

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
  { href: "/", label: "Salir", icon: <PiSignOut size={18} /> },
];

interface INavbar {
  nombre?: string;
  rol?: string;
}

export default function Navbar({
  nombre = "ValerieQueen",
  rol = "Administrador",
}: INavbar) {
  const pathname = usePathname();

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
      </nav>

      {/* Usuario */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <Avatar.Fallback>
              {nombre
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </Avatar.Fallback>
          </Avatar>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-[#16123f]">{nombre}</p>
            <p className="text-xs text-gray-400">{rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
}