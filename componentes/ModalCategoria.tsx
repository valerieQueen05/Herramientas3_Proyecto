"use client";

import { useState } from "react";
import Modal from "./Modal";

export interface Categoria {
  id: number;
  nombre: string;
  estado: "Activo" | "Inactivo";
}

interface ModalCategoriaProps {
  categoria?: Categoria;
  onClose: () => void;
  onGuardar: (categoria: Omit<Categoria, "id">) => void;
}

export default function ModalCategoria({
  categoria,
  onClose,
  onGuardar,
}: ModalCategoriaProps) {
  const [nombre, setNombre] = useState(categoria?.nombre ?? "");
  const [estado, setEstado] = useState<Categoria["estado"]>(categoria?.estado ?? "Activo");

  const esEdicion = Boolean(categoria);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <Modal
      title={esEdicion ? "Editar Categoría" : "Nueva Categoría"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onGuardar({ nombre, estado })}
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {esEdicion ? "Guardar Cambios" : "Crear Categoría"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <input
            className={inputClass}
            placeholder="Ej: Cafés Calientes"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select
            className={inputClass}
            value={estado}
            onChange={(e) => setEstado(e.target.value as Categoria["estado"])}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}