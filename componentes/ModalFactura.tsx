"use client";

import { Mail, Printer } from "lucide-react";
import Modal from "./Modal";
import { Pedido, formatoCOP, valorPedido } from "./pedidosData";

interface ModalFacturaProps {
  pedido: Pedido;
  onClose: () => void;
}

export default function ModalFactura({ pedido, onClose }: ModalFacturaProps) {
  return (
    <Modal
      title={`Factura #${pedido.id}`}
      onClose={onClose}
      maxWidthClass="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cerrar
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            <Mail size={15} />
            Enviar por correo
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            <Printer size={15} />
            Imprimir factura
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between border-b border-gray-100 pb-3">
          <div>
            <p className="font-bold text-[#16123f]">Café Aroma</p>
            <p className="text-xs text-gray-400">NIT: 900.123.456-7 · Pedidos Online</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Factura #{pedido.id}</p>
            <p className="text-xs text-gray-400">{pedido.fecha}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Cliente</p>
            <p className="font-medium text-gray-900">{pedido.cliente}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Ubicación de entrega</p>
            <p className="font-medium text-gray-900">{pedido.ubicacion}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">Detalle de productos</p>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                <th className="py-2 font-medium">Producto</th>
                <th className="py-2 text-center font-medium">Cantidad</th>
                <th className="py-2 text-right font-medium">Precio Unit.</th>
                <th className="py-2 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.productos.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 text-gray-900">{p.nombre}</td>
                  <td className="py-2 text-center text-gray-600">{p.cantidad}</td>
                  <td className="py-2 text-right text-gray-600">{formatoCOP(p.precioUnit)}</td>
                  <td className="py-2 text-right font-medium text-gray-900">
                    {formatoCOP(p.cantidad * p.precioUnit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#16123f] px-4 py-3">
          <span className="text-sm font-medium text-white">Total a pagar</span>
          <span className="text-lg font-bold text-white">{formatoCOP(valorPedido(pedido))}</span>
        </div>
      </div>
    </Modal>
  );
}