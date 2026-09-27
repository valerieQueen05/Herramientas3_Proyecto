"use client";

import { useState } from "react";
import { Eye, Check, X } from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import Title from "../../../componentes/Title";
import CardAroma from "../../../componentes/CardAroma";
import Badge from "../../../componentes/Badge";
import ModalConfirmarAccion from "../../../componentes/ModalConfirmarAccion";
import ModalDetallePedido from "../../../componentes/ModalDetallePedido";
import { Pedido, pedidosIniciales, formatoCOP, valorPedido } from "../../../componentes/pedidosData";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [pedidoAAceptar, setPedidoAAceptar] = useState<Pedido | null>(null);
  const [pedidoARechazar, setPedidoARechazar] = useState<Pedido | null>(null);
  const [pedidoAVer, setPedidoAVer] = useState<Pedido | null>(null);

  const totales = {
    total: pedidos.length,
    entregados: pedidos.filter((p) => p.estado === "Entregado").length,
    pendientes: pedidos.filter((p) => p.estado === "Pendiente").length,
    cancelados: pedidos.filter((p) => p.estado === "Cancelado").length,
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    const coincideEstado = filtroEstado === "Todos" || p.estado === filtroEstado;
    const coincideCliente = p.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
    const coincideBusqueda =
      String(p.id).includes(busqueda) || p.cliente.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideCliente && coincideBusqueda;
  });

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-xs font-medium text-gray-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <Title title="Pedidos" icon="assignment" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardAroma
            icon="assignment"
            value={totales.total}
            description="Total Pedidos"
            backgroundColor="bg-white"
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
          />
          <CardAroma
            icon="check"
            value={totales.entregados}
            description="Entregados"
            backgroundColor="bg-emerald-50"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <CardAroma
            icon="clock"
            value={totales.pendientes}
            description="Pendientes"
            backgroundColor="bg-blue-50"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <CardAroma
            icon="xCircle"
            value={totales.cancelados}
            description="Cancelados"
            backgroundColor="bg-red-50"
            iconBg="bg-red-100"
            iconColor="text-red-500"
          />
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-700">Filtros de búsqueda</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>Estado</label>
              <select className={inputClass} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                <option>Todos</option>
                <option>Solicitado</option>
                <option>Pendiente</option>
                <option>Entregado</option>
                <option>Cancelado</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Fecha</label>
              <input type="date" className={inputClass} value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Cliente</label>
              <input
                className={inputClass}
                placeholder="Nombre del cliente"
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Buscar</label>
              <input
                className={inputClass}
                placeholder="ID o cliente"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 font-medium">ID Orden</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Ubicación</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 text-right font-medium">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-6 py-3 font-medium text-gray-900">#{p.id}</td>
                  <td className="px-6 py-3 text-gray-500">{p.fecha}</td>
                  <td className="px-6 py-3 text-gray-700">{p.cliente}</td>
                  <td className="px-6 py-3 text-gray-500">{p.ubicacion}</td>
                  <td className="px-6 py-3 font-medium text-gray-700">{formatoCOP(valorPedido(p))}</td>
                  <td className="px-6 py-3">
                    <Badge
                      variant={p.estado.toLowerCase() as "solicitado" | "pendiente" | "entregado" | "cancelado"}
                      label={p.estado}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-2">
                      {p.estado === "Solicitado" && (
                        <>
                          <button
                            onClick={() => setPedidoAAceptar(p)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                          >
                            <Check size={13} />
                            Aceptar
                          </button>
                          <button
                            onClick={() => setPedidoARechazar(p)}
                            className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100"
                          >
                            <X size={13} />
                            Rechazar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setPedidoAVer(p)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100"
                      >
                        <Eye size={13} />
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {pedidoAAceptar && (
        <ModalConfirmarAccion
          titulo="Aceptar Pedido"
          mensaje={`¿Confirmas que deseas aceptar el pedido #${pedidoAAceptar.id}? El estado cambiará a Pendiente.`}
          textoBoton="Aceptar"
          colorBoton="navy"
          onCancelar={() => setPedidoAAceptar(null)}
          onConfirmar={() => {
            setPedidos((prev) =>
              prev.map((p) => (p.id === pedidoAAceptar.id ? { ...p, estado: "Pendiente" } : p))
            );
            setPedidoAAceptar(null);
          }}
        />
      )}

      {pedidoARechazar && (
        <ModalConfirmarAccion
          titulo="Rechazar Pedido"
          mensaje={`¿Confirmas que deseas rechazar el pedido #${pedidoARechazar.id}? El estado cambiará a Cancelado.`}
          textoBoton="Rechazar"
          colorBoton="rojo"
          onCancelar={() => setPedidoARechazar(null)}
          onConfirmar={() => {
            setPedidos((prev) =>
              prev.map((p) => (p.id === pedidoARechazar.id ? { ...p, estado: "Cancelado" } : p))
            );
            setPedidoARechazar(null);
          }}
        />
      )}

      {pedidoAVer && <ModalDetallePedido pedido={pedidoAVer} onClose={() => setPedidoAVer(null)} />}
    </div>
  );
}