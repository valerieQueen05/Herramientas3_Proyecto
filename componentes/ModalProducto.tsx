"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import Modal from "./Modal";

export interface Producto {
  id: number;
  categoria: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  estado: "Activo" | "Inactivo";
  emoji: string;
}

const categoriasDisponibles = ["Cafés Calientes", "Bebidas Frías", "Postres", "Panadería", "Snacks"];

interface ModalProductoProps {
  producto?: Producto;
  onClose: () => void;
  onGuardar: (producto: Omit<Producto, "id">) => void;
}

export default function ModalProducto({ producto, onClose, onGuardar }: ModalProductoProps) {
  const [categoria, setCategoria] = useState(producto?.categoria ?? categoriasDisponibles[0]);
  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precio, setPrecio] = useState(producto?.precio?.toString() ?? "");
  const [stock, setStock] = useState(producto?.stock?.toString() ?? "");
  const [estado, setEstado] = useState<Producto["estado"]>(producto?.estado ?? "Activo");
  const [emoji, setEmoji] = useState(producto?.emoji ?? "☕");

  const esEdicion = Boolean(producto);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <Modal
      title={esEdicion ? "Editar Producto" : "Nuevo Producto"}
      onClose={onClose}
      maxWidthClass="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              onGuardar({
                categoria,
                nombre,
                descripcion,
                precio: Number(precio) || 0,
                stock: Number(stock) || 0,
                estado,
                emoji,
              })
            }
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {esEdicion ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Categoría</label>
            <select className={inputClass} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categoriasDisponibles.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            className={`${inputClass} min-h-17.5 resize-none`}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Espresso suave con leche vaporizada y arte en la espuma."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Precio (COP)</label>
            <input className={inputClass} value={precio} onChange={(e) => setPrecio(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input className={inputClass} value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Estado</label>
          <select
            className={inputClass}
            value={estado}
            onChange={(e) => setEstado(e.target.value as Producto["estado"])}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Icono del producto</label>
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 text-2xl">
              {emoji}
              <button
                onClick={() => setEmoji("")}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                aria-label="Quitar icono"
              >
                <X size={12} />
              </button>
            </div>
            <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-4 text-xs text-gray-400 transition hover:border-[#16123f] hover:text-[#16123f]">
              <Upload size={16} />
              Elige un emoji representativo
              <input
                type="text"
                maxLength={2}
                className="sr-only"
                onChange={(e) => setEmoji(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}