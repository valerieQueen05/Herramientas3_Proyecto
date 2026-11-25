"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/src/commons/utils/api";
import { formatearFechaLocal, formatoCOP } from "@/src/commons/lib/pedidosData";
import { EstadoPedido, Order } from "@/src/features/admin/pedidos/domain/order.entity";

const mensajePorEstado = (
  order: Order
): { titulo: string; descripcion: string; activa: boolean } => {
  const textos: Record<EstadoPedido, { titulo: string; descripcion: string; activa: boolean }> = {
    SOLICITADO: {
      titulo: `Pedido #${order.id} recibido`,
      descripcion: `Tu pedido por ${formatoCOP(order.total)} está esperando confirmación.`,
      activa: true,
    },
    PENDIENTE: {
      titulo: `Pedido #${order.id} en preparación`,
      descripcion: `Aceptamos tu orden hacia ${order.direccion || "tu dirección"} y la estamos preparando.`,
      activa: true,
    },
    ENTREGADO: {
      titulo: `Pedido #${order.id} entregado`,
      descripcion: `Tu pedido por ${formatoCOP(order.total)} fue entregado con éxito.`,
      activa: false,
    },
    CANCELADO: {
      titulo: `Pedido #${order.id} cancelado`,
      descripcion: `Tu orden #${order.id} fue cancelada.`,
      activa: false,
    },
  };

  return textos[order.estado];
};

export default function NotificacionesUsuario() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ data: Order[] }>("/api/order")
      .then((res) => {
        const ordenados = [...res.data].sort(
          (a, b) =>
            new Date(b.fechaActualizacion).getTime() -
            new Date(a.fechaActualizacion).getTime()
        );
        setPedidos(ordenados);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar notificaciones")
      )
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#16123f]">Notificaciones</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Mantente al tanto del estado de tus pedidos y novedades.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {cargando ? (
        <p className="text-sm text-gray-400">Cargando notificaciones...</p>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center text-sm text-gray-400 shadow-sm">
          Aún no tienes notificaciones. Realiza tu primer pedido en Café Aroma.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pedidos.map((order) => {
            const info = mensajePorEstado(order);
            const { fecha } = formatearFechaLocal(order.fechaActualizacion);

            return (
              <div
                key={order.id}
                className={`flex items-center justify-between p-4 md:p-5 rounded-3xl shadow-sm transition-colors ${
                  info.activa ? "bg-[#e8f4ec]" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      info.activa
                        ? "bg-[#75c9b7] text-white"
                        : "bg-gray-100 text-[#16123f]"
                    }`}
                  >
                    <Bell size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#16123f] text-sm md:text-base">
                      {info.titulo}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                      {info.descripcion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-gray-400 text-xs font-medium">{fecha}</span>
                  {info.activa && (
                    <CheckCircle2 className="text-[#75c9b7]" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
