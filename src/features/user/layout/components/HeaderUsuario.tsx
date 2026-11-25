"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { apiFetch } from "@/src/commons/utils/api";
import { Order } from "@/src/features/admin/pedidos/domain/order.entity";

interface HeaderUsuarioProps {
  user?: {
    nombre: string;
    apellido: string;
    rol: string;
  };
}

const capitalizar = (texto: string) =>
  texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

export default function HeaderUsuario({ user }: HeaderUsuarioProps) {
  const [activos, setActivos] = useState(0);

  const cargarConteo = useCallback(() => {
    apiFetch<{ data: Order[] }>("/api/order")
      .then((res) => {
        const pendientes = res.data.filter(
          (o) => o.estado === "SOLICITADO" || o.estado === "PENDIENTE"
        ).length;
        setActivos(pendientes);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    cargarConteo();
    window.addEventListener("orders-updated", cargarConteo);
    return () => window.removeEventListener("orders-updated", cargarConteo);
  }, [cargarConteo]);

  const nombreCompleto = user
    ? `${user.nombre} ${user.apellido}`.trim()
    : "Cliente";
  const iniciales = nombreCompleto
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const rolLabel = user ? capitalizar(user.rol) : "Cliente";

  return (
    <header className="h-24 flex items-center justify-end px-10 w-full">
      <div className="flex items-center gap-6">
        {/* Icono de campana con su indicador Teal */}
        <Link
          href="/user/notificaciones"
          className="relative p-2 text-[#16123f] hover:opacity-70 transition-opacity bg-white rounded-full shadow-sm"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
          {activos > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#75c9b7] text-[#16123f] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activos}
            </span>
          )}
        </Link>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3">
          <div className="bg-[#16123f] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
            {iniciales}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#16123f]">{nombreCompleto}</span>
            <span className="text-gray-500 text-[11px]">{rolLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
