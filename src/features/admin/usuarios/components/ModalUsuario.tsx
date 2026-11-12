"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/src/commons/components/Modal";
import CampoError from "@/src/commons/components/CampoError";
import { apiFetch } from "@/src/commons/utils/api";
import {
  crearUsuarioSchema,
  UsuarioFormData,
} from "@/src/features/admin/usuarios/schemas/usuarioSchema";

// Así se ve un usuario en la tabla (sin contraseña)
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: "Administrador" | "Administrativo" | "Mensajero" | "Cliente";
  estado: "Activo" | "Inactivo";
}

interface ModalUsuarioProps {
  usuario?: Usuario;
  onClose: () => void;
  onGuardar: () => void;
  onNotificar?: (mensaje: string, tipo: "success" | "error" | "loading") => void;
}

export default function ModalUsuario({
  usuario,
  onClose,
  onGuardar,
  onNotificar,
}: ModalUsuarioProps) {
  const esEdicion = Boolean(usuario);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(crearUsuarioSchema(esEdicion)),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      apellido: usuario?.apellido ?? "",
      email: usuario?.email ?? "",
      rol: usuario?.rol ?? "Administrativo",
      estado: usuario?.estado ?? "Activo",
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const enviar = async (data: UsuarioFormData) => {
    try {
      setIsSubmitting(true);
      onNotificar?.("Guardando...", "loading");

      // Crear = POST /api/user  |  Editar = PATCH /api/user/:id
      // La contraseña viaja al servidor y allá se guarda como hash
      const method = usuario ? "PATCH" : "POST";
      const url = usuario ? `/api/user/${usuario.id}` : "/api/user";

      const res = await apiFetch<{ message: string }>(url, { method, body: data });

      onNotificar?.(res.message, "success");
      onGuardar();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      onNotificar?.(error instanceof Error ? error.message : "Error al guardar", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-usuario"
            disabled={isSubmitting}
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </>
      }
    >
      <form id="form-usuario" onSubmit={handleSubmit(enviar)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} placeholder="Ej: Juan" {...register("nombre")} />
            <CampoError mensaje={errors.nombre?.message} />
          </div>
          <div>
            <label className={labelClass}>Apellido</label>
            <input className={inputClass} placeholder="Ej: Pérez" {...register("apellido")} />
            <CampoError mensaje={errors.apellido?.message} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Correo electrónico</label>
          <input
            type="email"
            className={inputClass}
            placeholder="usuario@cafearoma.co"
            {...register("email")}
          />
          <CampoError mensaje={errors.email?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Rol</label>
            <select className={inputClass} {...register("rol")}>
              <option>Administrador</option>
              <option>Administrativo</option>
              <option>Mensajero</option>
              <option>Cliente</option>
            </select>
            <CampoError mensaje={errors.rol?.message} />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select className={inputClass} {...register("estado")}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
            <CampoError mensaje={errors.estado?.message} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contraseña</label>
            <input
              type="password"
              className={inputClass}
              placeholder={esEdicion ? "Dejar vacía para no cambiar" : "••••••••"}
              {...register("contrasena")}
            />
            <CampoError mensaje={errors.contrasena?.message} />
          </div>
          <div>
            <label className={labelClass}>Confirmar contraseña</label>
            <input
              type="password"
              className={inputClass}
              placeholder="••••••••"
              {...register("confirmarContrasena")}
            />
            <CampoError mensaje={errors.confirmarContrasena?.message} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
