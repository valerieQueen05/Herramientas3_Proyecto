"use client";

import { useState } from "react";
import { LayoutGrid, Plus, Pencil, Trash2 } from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import EncabezadoSeccion from "../../../componentes/EncabezadoSeccion";
import Buscador from "../../../componentes/Buscador";
import Badge from "../../../componentes/Badge";
import ModalCategoria, { Categoria } from "../../../componentes/ModalCategoria";
import ModalConfirmarEliminar from "../../../componentes/ModalConfirmarEliminar";

const categoriasIniciales: Categoria[] = [
  { id: 1, nombre: "Cafés Calientes", estado: "Activo" },
  { id: 2, nombre: "Bebidas Frías", estado: "Activo" },
  { id: 3, nombre: "Postres", estado: "Activo" },
  { id: 4, nombre: "Panadería", estado: "Activo" },
  { id: 5, nombre: "Snacks", estado: "Inactivo" },
];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState(categoriasIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState<"nuevo" | "editar" | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null);

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardarCategoria = (datos: Omit<Categoria, "id">) => {
    if (modalAbierto === "editar" && categoriaSeleccionada) {
      setCategorias((prev) =>
        prev.map((c) => (c.id === categoriaSeleccionada.id ? { ...c, ...datos } : c))
      );
    } else {
      setCategorias((prev) => [...prev, { id: Math.max(0, ...prev.map((c) => c.id)) + 1, ...datos }]);
    }
    setModalAbierto(null);
    setCategoriaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <EncabezadoSeccion
          icon={LayoutGrid}
          titulo="Categorías"
          subtitulo="Organiza los productos por categoría"
          accion={
            <button
              onClick={() => setModalAbierto("nuevo")}
              className="flex items-center gap-2 rounded-lg bg-[#16123f] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Plus size={16} />
              Nueva Categoría
            </button>
          }
        />

        <Buscador placeholder="Buscar categoría..." value={busqueda} onChange={setBusqueda} />

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasFiltradas.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-6 py-3 text-gray-400">#{c.id}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.nombre}</td>
                  <td className="px-6 py-3">
                    <Badge variant={c.estado.toLowerCase() as "activo" | "inactivo"} label={c.estado} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button
                        onClick={() => {
                          setCategoriaSeleccionada(c);
                          setModalAbierto("editar");
                        }}
                        className="transition hover:text-[#16123f]"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setCategoriaAEliminar(c)}
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
        <ModalCategoria
          categoria={categoriaSeleccionada ?? undefined}
          onClose={() => {
            setModalAbierto(null);
            setCategoriaSeleccionada(null);
          }}
          onGuardar={guardarCategoria}
        />
      )}

      {categoriaAEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar Categoría"
          nombre={categoriaAEliminar.nombre}
          onCancelar={() => setCategoriaAEliminar(null)}
          onConfirmar={() => {
            setCategorias((prev) => prev.filter((c) => c.id !== categoriaAEliminar.id));
            setCategoriaAEliminar(null);
          }}
        />
      )}
    </div>
  );
}