"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Calendar, RefreshCw, ChevronRight, Eye } from "lucide-react";
import Badge from "@/src/commons/components/Badge";
import ModalDetallePedido from "@/src/features/admin/pedidos/components/ModalDetallePedido";
import { Pedido } from "@/src/commons/types/pedido";
import { formatoCOP, orderToPedido, valorPedido } from "@/src/commons/lib/pedidosData";
import { apiFetch } from "@/src/commons/utils/api";
import { Order } from "@/src/features/admin/pedidos/domain/order.entity";

export default function PedidosUsuario() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [pedidoAVer, setPedidoAVer] = useState<Pedido | null>(null);

  useEffect(() => {
    apiFetch<{ data: Order[] }>("/api/order")
      .then((res) => setPedidos(res.data.map(orderToPedido)))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error al cargar tus pedidos")
      )
      .finally(() => setCargando(false));
  }, []);

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstado === "Todos" || p.estado === filtroEstado;
    const coincideFecha = !filtroFecha || p.fechaISO === filtroFecha;
    return coincideEstado && coincideFecha;
  });

  const volverAPedir = (pedido: Pedido) => {
    const items = pedido.productos
      .filter((p) => p.productoId !== undefined)
      .map((p) => ({
        productoId: p.productoId as number,
        cantidad: p.cantidad,
      }));

    if (items.length > 0) {
      sessionStorage.setItem("cafe_aroma_reorder", JSON.stringify(items));
    }
    router.push("/user/solicitar");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la sección */}
      <div>
        <h1 className="text-2xl font-bold text-[#16123f]">Últimos Pedidos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Consulta el historial de tus pedidos y vuelve a realizarlos.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={14} /> Estado
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-[#f0f7f4] border-none rounded-xl px-4 py-3 text-sm text-[#16123f] outline-none focus:ring-2 focus:ring-[#75c9b7] cursor-pointer"
          >
            <option>Todos</option>
            <option>Solicitado</option>
            <option>Pendiente</option>
            <option>Entregado</option>
            <option>Cancelado</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Calendar size={14} /> Fecha
          </label>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="bg-[#f0f7f4] border-none rounded-xl px-4 py-3 text-sm text-[#16123f] outline-none focus:ring-2 focus:ring-[#75c9b7]"
          />
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Orden</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Dirección</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Opciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Cargando tus pedidos...
                  </td>
                </tr>
              ) : pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Aún no tienes pedidos con esos filtros.
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#16123f]">#{pedido.id}</td>
                    <td className="px-6 py-4 text-gray-500">{pedido.fecha}</td>
                    <td className="px-6 py-4 text-gray-500">{pedido.ubicacion}</td>
                    <td className="px-6 py-4 font-bold text-[#16123f]">
                      {formatoCOP(valorPedido(pedido))}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          pedido.estado.toLowerCase() as
                            | "solicitado"
                            | "pendiente"
                            | "entregado"
                            | "cancelado"
                        }
                        label={pedido.estado}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setPedidoAVer(pedido)}
                          className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Eye size={13} />
                          Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => volverAPedir(pedido)}
                          className="inline-flex items-center gap-2 bg-[#16123f] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#2a235f] transition-colors cursor-pointer"
                        >
                          <RefreshCw size={12} />
                          Volver a pedir
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pedidoAVer && (
        <ModalDetallePedido pedido={pedidoAVer} onClose={() => setPedidoAVer(null)} />
      )}
    </div>
  );
}
