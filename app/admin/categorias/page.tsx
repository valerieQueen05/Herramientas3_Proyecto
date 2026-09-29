"use client";

import { useState } from "react";
import { LayoutGrid, Plus} from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import EncabezadoSeccion from "../../../componentes/EncabezadoSeccion";
import ModalCategoria, { Categoria } from "../../../componentes/ModalCategoria";
import ModalConfirmarEliminar from "../../../componentes/ModalConfirmarEliminar";
import TableAroma from "../../../componentes/TableAroma";

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