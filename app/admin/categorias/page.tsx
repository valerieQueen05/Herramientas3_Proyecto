"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, Plus} from "lucide-react";
import Navbar from "@/src/commons/components/Barralateral";
import EncabezadoSeccion from "@/src/commons/components/EncabezadoSeccion";
import ModalCategoria, { Categoria } from "@/src/features/admin/categorias/components/ModalCategoria";
import ModalConfirmarEliminar from "@/src/commons/components/ModalConfirmarEliminar";
import TableAroma from "@/src/commons/components/TableAroma";

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
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: "success" | "error" | "loading";
  } | null>(null);

  useEffect(() => {
    if (!notificacion || notificacion.tipo === "loading") return;

    const timeout = setTimeout(() => setNotificacion(null), 4000);
    return () => clearTimeout(timeout);
  }, [notificacion]);

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

  const handleEdit = (categoria: Categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto("editar");
  }

  const handleDelete = (categoria: Categoria) => {
    setCategoriaAEliminar(categoria);
  }

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
              <Plus size={16} />x
              Nueva Categoría
            </button>
          }
        />
        <TableAroma 
        headers={["ID", "Nombre", "Estado", "Acciones"]} 
        data={categoriasFiltradas} 
        handleEdit={handleEdit} 
        handleDelete={handleDelete}
        handleSearch={setBusqueda}
        searchValue={busqueda}
        />
      </main>

      {modalAbierto && (
        <ModalCategoria
          categoria={categoriaSeleccionada ?? undefined}
          onClose={() => {
            setModalAbierto(null);
            setCategoriaSeleccionada(null);
          }}
          onGuardar={guardarCategoria}
          onNotificar={(mensaje, tipo) => setNotificacion({ mensaje, tipo })}
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