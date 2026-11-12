"use client";

import { useCallback, useEffect, useState } from "react";
import { LayoutGrid, Plus} from "lucide-react";
import Navbar from "@/src/commons/components/Barralateral";
import EncabezadoSeccion from "@/src/commons/components/EncabezadoSeccion";
import ModalCategoria, { Categoria } from "@/src/features/admin/categorias/components/ModalCategoria";
import ModalConfirmarEliminar from "@/src/commons/components/ModalConfirmarEliminar";
import TableAroma from "@/src/commons/components/TableAroma";
import { apiFetch } from "@/src/commons/utils/api";
import { CategoryList } from "@/src/features/admin/categorias/domain/category.entity";

// La API devuelve los campos de la BD (titulo, activo); la tabla usa (nombre, estado)
const toCategoria = (c: CategoryList): Categoria => ({
  id: c.id,
  nombre: c.titulo,
  estado: c.activo ? "Activo" : "Inactivo",
});

const obtenerCategorias = async () => {
  const res = await apiFetch<{ data: CategoryList[] }>("/api/category");
  return res.data.map(toCategoria);
};

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState<"nuevo" | "editar" | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState<Categoria | null>(null);
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: "success" | "error" | "loading";
  } | null>(null);

  const cargarCategorias = useCallback(() => {
    obtenerCategorias()
      .then(setCategorias)
      .catch((error) =>
        setNotificacion({
          mensaje: error instanceof Error ? error.message : "Error al cargar las categorías",
          tipo: "error",
        })
      );
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  useEffect(() => {
    if (!notificacion || notificacion.tipo === "loading") return;

    const timeout = setTimeout(() => setNotificacion(null), 4000);
    return () => clearTimeout(timeout);
  }, [notificacion]);

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // El modal ya guardó en la API; aquí solo cerramos y recargamos la lista
  const guardarCategoria = () => {
    setModalAbierto(null);
    setCategoriaSeleccionada(null);
    cargarCategorias();
  };

  const eliminarCategoria = async (categoria: Categoria) => {
    try {
      setNotificacion({ mensaje: "Eliminando...", tipo: "loading" });
      const res = await apiFetch<{ message: string }>(`/api/category/${categoria.id}`, {
        method: "DELETE",
      });
      setNotificacion({ mensaje: res.message, tipo: "success" });
      cargarCategorias();
    } catch (error) {
      setNotificacion({
        mensaje: error instanceof Error ? error.message : "Error al eliminar",
        tipo: "error",
      });
    } finally {
      setCategoriaAEliminar(null);
    }
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
              <Plus size={16} />
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
          onConfirmar={() => eliminarCategoria(categoriaAEliminar)}
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