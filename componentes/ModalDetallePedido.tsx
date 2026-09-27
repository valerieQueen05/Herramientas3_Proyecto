"use client";

import { MapPin } from "lucide-react";
import Modal from "./Modal";
import Badge from "./Badge";
import { Pedido, formatoCOP } from "./pedidosData";

interface ModalDetallePedidoProps {
  pedido: Pedido;
  onClose: () => void;
}

export default function ModalDetallePedido({ pedido, onClose }: ModalDetallePedidoProps) {
  const total = pedido.productos.reduce((acc, p) => acc + p.cantidad * p.precioUnit, 0);

  return (
    <Modal
      title={`Pedido #${pedido.id}`}
      onClose={onClose}
      maxWidthClass="max-w-md"
      footer={
        <button
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          Cerrar
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge variant={pedido.estado.toLowerCase() as "solicitado" | "pendiente" | "entregado" | "cancelado"} label={pedido.estado} />
          <span className="text-xs text-gray-400">{pedido.fecha}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Cliente</p>
            <p className="font-medium text-gray-900">{pedido.cliente}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Ubicación</p>
            <p className="flex items-center gap-1 font-medium text-gray-900">
              <MapPin size={13} className="text-gray-400" />
              {pedido.ubicacion}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">Productos del pedido</p>
          <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-100">
            {pedido.productos.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <div>
                  <p className="font-medium text-gray-900">{p.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {p.cantidad} x {formatoCOP(p.precioUnit)}
                  </p>
                </div>
                <span className="font-medium text-gray-700">{formatoCOP(p.cantidad * p.precioUnit)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
          <span className="text-sm font-medium text-gray-700">Total del pedido</span>
          <span className="text-lg font-bold text-emerald-700">{formatoCOP(total)}</span>
        </div>
      </div>
    </Modal>
  );
}