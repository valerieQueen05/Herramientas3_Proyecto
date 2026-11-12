"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/src/commons/components/Barralateral";
import EncabezadoSeccion from "@/src/commons/components/EncabezadoSeccion";
import Buscador from "@/src/commons/components/Buscador";
import Badge from "@/src/commons/components/Badge";
import ModalUsuario, { Usuario } from "@/src/features/admin/usuarios/components/ModalUsuario";
import ModalConfirmarEliminar from "@/src/commons/components/ModalConfirmarEliminar";
import { apiFetch } from "@/src/commons/utils/api";
import { User } from "@/src/features/admin/usuarios/domain/user.entity";

// "ADMINISTRADOR" -> "Administrador"
const capitalizar = (texto: string) => texto.charAt(0) + texto.slice(1).toLowerCase();

// La API devuelve los campos de la BD (rol en mayúsculas, activo); la tabla usa (rol, estado)
const toUsuario = (u: User): Usuario => ({
  id: u.id,
  nombre: u.nombre,
  apellido: u.apellido,
  email: u.email,
  rol: capitalizar(u.rol) as Usuario["rol"],
  estado: u.activo ? "Activo" : "Inactivo",
});

const obtenerUsuarios = async () => {
  const res = await apiFetch<{ data: User[] }>("/api/user");
  return res.data.map(toUsuario);
};

const coloresAvatar = ["bg-teal-100 text-teal-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700", "bg-blue-100 text-blue-700"];

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState<"nuevo" | "editar" | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: "success" | "error" | "loading";
  } | null>(null);

  const cargarUsuarios = useCallback(() => {
    obtenerUsuarios()
      .then(setUsuarios)
      .catch((error) =>
        setNotificacion({
          mensaje: error instanceof Error ? error.message : "Error al cargar los usuarios",
          tipo: "error",
        })
      );
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    if (!notificacion || notificacion.tipo === "loading") return;

    const timeout = setTimeout(() => setNotificacion(null), 4000);
    return () => clearTimeout(timeout);
  }, [notificacion]);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  // El modal ya guardó en la API; aquí solo cerramos y recargamos la lista
  const guardarUsuario = () => {
    setModalAbierto(null);
    setUsuarioSeleccionado(null);
    cargarUsuarios();
  };

  const eliminarUsuario = async (usuario: Usuario) => {
    try {
      setNotificacion({ mensaje: "Eliminando...", tipo: "loading" });
      const res = await apiFetch<{ message: string }>(`/api/user/${usuario.id}`, {
        method: "DELETE",
      });
      setNotificacion({ mensaje: res.message, tipo: "success" });
      cargarUsuarios();
    } catch (error) {
      setNotificacion({
        mensaje: error instanceof Error ? error.message : "Error al eliminar",
        tipo: "error",
      });
    } finally {
      setUsuarioAEliminar(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <EncabezadoSeccion
          icon={Users}
          titulo="Usuarios"
          subtitulo="Gestión del personal del sistema"
          accion={
            <button
              onClick={() => setModalAbierto("nuevo")}
              className="flex items-center gap-2 rounded-lg bg-[#16123f] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Plus size={16} />
              Nuevo Usuario
            </button>
          }
        />

        <Buscador
          placeholder="Buscar por nombre o correo..."
          value={busqueda}
          onChange={setBusqueda}
        />

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Rol</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u, i) => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-6 py-3 text-gray-400">#{u.id}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${coloresAvatar[i % coloresAvatar.length]}`}
                      >
                        {iniciales(`${u.nombre} ${u.apellido}`)}
                      </span>
                      <span className="font-medium text-gray-900">{u.nombre} {u.apellido}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <Badge
                      variant={u.rol.toLowerCase() as "administrador" | "administrativo" | "mensajero" | "cliente"}
                      label={u.rol}
                    />
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={u.estado.toLowerCase() as "activo" | "inactivo"} label={u.estado} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button
                        onClick={() => {
                          setUsuarioSeleccionado(u);
                          setModalAbierto("editar");
                        }}
                        className="transition hover:text-[#16123f]"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setUsuarioAEliminar(u)}
                        className="transition hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {modalAbierto && (
        <ModalUsuario
          usuario={usuarioSeleccionado ?? undefined}
          onClose={() => {
            setModalAbierto(null);
            setUsuarioSeleccionado(null);
          }}
          onGuardar={guardarUsuario}
          onNotificar={(mensaje, tipo) => setNotificacion({ mensaje, tipo })}
        />
      )}

      {usuarioAEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar Usuario"
          nombre={usuarioAEliminar.nombre}
          onCancelar={() => setUsuarioAEliminar(null)}
          onConfirmar={() => eliminarUsuario(usuarioAEliminar)}
        />
      )}

      {notificacion && (
        <div
          role={notificacion.tipo === "error" ? "alert" : "status"}
          className={`fixed right-6 top-6 z-[60] flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${
            notificacion.tipo === "error"
              ? "bg-red-600"
              : notificacion.tipo === "success"
                ? "bg-green-600"
                : "bg-[#16123f]"
          }`}
        >
          {notificacion.tipo === "loading" && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          <span>{notificacion.mensaje}</span>
          {notificacion.tipo !== "loading" && (
            <button
              type="button"
              onClick={() => setNotificacion(null)}
              className="ml-2 font-semibold"
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  );
}