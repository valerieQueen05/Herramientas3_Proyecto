"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/src/commons/components/Modal";
import CampoError from "@/src/commons/components/CampoError";
import {
  crearUsuarioSchema,
  UsuarioFormData,
} from "@/src/features/admin/usuarios/schemas/usuarioSchema";

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
  const esEdicion = Boolean(usuario);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(crearUsuarioSchema(esEdicion)),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      email: usuario?.email ?? "",
      rol: usuario?.rol ?? "Administrativo",
      estado: usuario?.estado ?? "Activo",
      contrasena: "",
      confirmarContrasena: "",
    },
  });

  // La contraseña se valida aquí, pero aún no se guarda: Usuario (datos de prueba) no la tiene.
  // Cuando se conecte a la base, se enviará al servidor para guardarla como hash.
  const enviar = ({ nombre, email, rol, estado }: UsuarioFormData) =>
    onGuardar({ nombre, email, rol, estado });

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
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {esEdicion ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </>
      }
    >
      <form id="form-usuario" onSubmit={handleSubmit(enviar)} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nombre completo</label>
          <input className={inputClass} placeholder="Ej: Juan Pérez" {...register("nombre")} />
          <CampoError mensaje={errors.nombre?.message} />
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
