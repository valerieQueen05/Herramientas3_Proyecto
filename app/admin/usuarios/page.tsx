"use client";

import { useState } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import EncabezadoSeccion from "../../../componentes/EncabezadoSeccion";
import Buscador from "../../../componentes/Buscador";
import Badge from "../../../componentes/Badge";
import ModalUsuario, { Usuario } from "../../../componentes/ModalUsuario";
import ModalConfirmarEliminar from "../../../componentes/ModalConfirmarEliminar";

const usuariosIniciales: Usuario[] = [
  { id: 1, nombre: "María González", email: "maria.gonzalez@cafearoma.co", rol: "Administrador", estado: "Activo" },
  { id: 2, nombre: "Carlos Restrepo", email: "carlos.restrepo@cafearoma.co", rol: "Administrativo", estado: "Activo" },
  { id: 3, nombre: "Andrea Torres", email: "andrea.torres@cafearoma.co", rol: "Administrativo", estado: "Inactivo" },
  { id: 4, nombre: "Juan Moreno", email: "juan.moreno@cafearoma.co", rol: "Mensajero", estado: "Activo" },
  { id: 5, nombre: "Sofía Vargas", email: "sofia.vargas@cafearoma.co", rol: "Mensajero", estado: "Activo" },
  { id: 6, nombre: "Diego Pineda", email: "diego.pineda@cafearoma.co", rol: "Mensajero", estado: "Inactivo" },
];

const coloresAvatar = ["bg-teal-100 text-teal-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700", "bg-blue-100 text-blue-700"];

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState<"nuevo" | "editar" | null>(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardarUsuario = (datos: Omit<Usuario, "id">) => {
    if (modalAbierto === "editar" && usuarioSeleccionado) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioSeleccionado.id ? { ...u, ...datos } : u))
      );
    } else {
      setUsuarios((prev) => [...prev, { id: Math.max(0, ...prev.map((u) => u.id)) + 1, ...datos }]);
    }
    setModalAbierto(null);
    setUsuarioSeleccionado(null);
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
                        {iniciales(u.nombre)}
                      </span>
                      <span className="font-medium text-gray-900">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <Badge
                      variant={u.rol.toLowerCase() as "administrador" | "administrativo" | "mensajero"}
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
        />
      )}

      {usuarioAEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar Usuario"
          nombre={usuarioAEliminar.nombre}
          onCancelar={() => setUsuarioAEliminar(null)}
          onConfirmar={() => {
            setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
            setUsuarioAEliminar(null);
          }}
        />
      )}
    </div>
  );
}