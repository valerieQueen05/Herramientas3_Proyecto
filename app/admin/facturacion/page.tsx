"use client";

import { useState } from "react";
import { FileText, Wallet, Calendar, Eye } from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import Title from "../../../componentes/Title";
import TarjetaFacturacion from "../../../componentes/TarjetaFacturacion";
import Badge from "../../../componentes/Badge";
import ModalFactura from "../../../componentes/ModalFactura";
import { Pedido, pedidosIniciales, formatoCOP, valorPedido } from "../../../componentes/pedidosData";

const fechaReporte = "2026-08-26";

export default function FacturacionPage() {
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [facturaAVer, setFacturaAVer] = useState<Pedido | null>(null);

  const facturas = pedidosIniciales.filter((p) => p.estado === "Entregado");
  const totalFacturado = facturas.reduce((acc, p) => acc + valorPedido(p), 0);

  const facturasFiltradas = facturas.filter((p) => {
    const coincideCliente = p.cliente.toLowerCase().includes(filtroCliente.toLowerCase());
    const coincideBusqueda =
      String(p.id).includes(busqueda) || p.cliente.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCliente && coincideBusqueda;
  });

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-xs font-medium text-gray-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <Title title="Facturación" icon="assignment" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TarjetaFacturacion
            icon={FileText}
            value={facturas.length}
            description="Facturas del día"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <TarjetaFacturacion
            icon={Wallet}
            value={formatoCOP(totalFacturado)}
            description="Total facturado"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <TarjetaFacturacion
            icon={Calendar}
            value={fechaReporte}
            description="Fecha del reporte"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-700">Filtros de búsqueda</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <th className="px-6 py-3 text-right font-medium">Detalles</th>
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-6 py-3 font-medium text-gray-900">#{p.id}</td>
                  <td className="px-6 py-3 text-gray-500">{p.fecha}</td>
                  <td className="px-6 py-3 text-gray-700">{p.cliente}</td>
                  <td className="px-6 py-3 text-gray-500">{p.ubicacion}</td>
                  <td className="px-6 py-3 font-medium text-gray-700">{formatoCOP(valorPedido(p))}</td>
                  <td className="px-6 py-3">
                    <Badge variant="entregado" label="Entregado" />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => setFacturaAVer(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                      <Eye size={13} />
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {facturaAVer && <ModalFactura pedido={facturaAVer} onClose={() => setFacturaAVer(null)} />}
    </div>
  );
}