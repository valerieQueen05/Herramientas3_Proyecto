"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Clock, CheckCircle2, XCircle, CheckSquare } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/src/commons/utils/api";
import { Order } from "@/src/features/admin/pedidos/domain/order.entity";

export default function InicioUsuario() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ data: Order[] }>("/api/order")
      .then((res) => setPedidos(res.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar tu resumen")
      )
      .finally(() => setCargando(false));
  }, []);

  const totales = {
    total: pedidos.length,
    pendientes: pedidos.filter((p) => p.estado === "SOLICITADO" || p.estado === "PENDIENTE").length,
    entregados: pedidos.filter((p) => p.estado === "ENTREGADO").length,
    cancelados: pedidos.filter((p) => p.estado === "CANCELADO").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la sección */}
      <div>
        <h1 className="text-2xl font-bold text-[#16123f]">Panel Principal</h1>
        <p className="text-gray-500 mt-1 text-sm">Resumen de tu actividad en Café Aroma.</p>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Cuadrícula de Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Tarjeta: Pedidos totales */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="bg-[#16123f] w-12 h-12 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="text-white" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#16123f]">
              {cargando ? "—" : totales.total}
            </p>
            <p className="text-gray-400 text-xs font-medium mt-1">Pedidos totales</p>
          </div>
        </div>

        {/* Tarjeta: Pendientes */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="bg-[#ffe26a] w-12 h-12 rounded-2xl flex items-center justify-center">
            <Clock className="text-[#16123f]" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#16123f]">
              {cargando ? "—" : totales.pendientes}
            </p>
            <p className="text-gray-400 text-xs font-medium mt-1">Pendientes</p>
          </div>
        </div>

        {/* Tarjeta: Entregados */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="bg-[#75c9b7] w-12 h-12 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="text-[#16123f]" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#16123f]">
              {cargando ? "—" : totales.entregados}
            </p>
            <p className="text-gray-400 text-xs font-medium mt-1">Entregados</p>
          </div>
        </div>

        {/* Tarjeta: Cancelados */}
        <div className="bg-white p-6 rounded-3xl shadow-sm flex flex-col gap-4">
          <div className="bg-gray-100 w-12 h-12 rounded-2xl flex items-center justify-center">
            <XCircle className="text-gray-400" size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#16123f]">
              {cargando ? "—" : totales.cancelados}
            </p>
            <p className="text-gray-400 text-xs font-medium mt-1">Cancelados</p>
          </div>
        </div>
      </div>

      {/* Banner: ¿Listo para pedir? */}
      <div className="bg-white p-8 rounded-3xl shadow-sm mt-2">
        <h2 className="text-lg font-bold text-[#16123f] mb-1">¿Listo para pedir?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Explora nuestro catálogo y realiza tu pedido en minutos.
        </p>

        <Link
          href="/user/solicitar"
          className="inline-flex items-center gap-2 bg-[#75c9b7] text-[#16123f] px-6 py-3 rounded-xl font-semibold hover:bg-[#5eb5a3] transition-colors text-sm"
        >
          <CheckSquare size={18} />
          Solicitar ahora
        </Link>
      </div>
    </div>
  );
}
