"use client";

import { useState } from "react";
import Modal from "./Modal";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: "Administrador" | "Administrativo" | "Mensajero";
  estado: "Activo" | "Inactivo";
}

interface ModalUsuarioProps {
  usuario?: Usuario;
  onClose: () => void;
  onGuardar: (usuario: Omit<Usuario, "id">) => void;
}

export default function ModalUsuario({
  usuario,
  onClose,
  onGuardar,
}: ModalUsuarioProps) {
  const [nombre, setNombre] = useState(usuario?.nombre ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [rol, setRol] = useState<Usuario["rol"]>(usuario?.rol ?? "Administrativo");
  const [estado, setEstado] = useState<Usuario["estado"]>(usuario?.estado ?? "Activo");

  const esEdicion = Boolean(usuario);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <Modal
      title={esEdicion ? "Editar Usuario" : "Nuevo Usuario"}
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
            onClick={() => onGuardar({ nombre, email, rol, estado })}
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {esEdicion ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nombre completo</label>
          <input
            className={inputClass}
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Correo electrónico</label>
          <input
            className={inputClass}
            placeholder="usuario@cafearoma.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rol</label>
            <select
              className={inputClass}
              value={rol}
              onChange={(e) => setRol(e.target.value as Usuario["rol"])}
            >
              <option>Administrador</option>
              <option>Administrativo</option>
              <option>Mensajero</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select
              className={inputClass}
              value={estado}
              onChange={(e) => setEstado(e.target.value as Usuario["estado"])}
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contraseña</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
        </div>
      </div>
    </Modal>
  );
}