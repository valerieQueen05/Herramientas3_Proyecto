"use client";

import { useState } from "react";
import { Coffee, Plus} from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import EncabezadoSeccion from "../../../componentes/EncabezadoSeccion";
import ModalProducto, { Producto } from "../../../componentes/ModalProducto";
import ModalConfirmarEliminar from "../../../componentes/ModalConfirmarEliminar";
import TableAroma from "../../../componentes/TableAroma";

const productosIniciales: Producto[] = [
  { id: 1, categoria: "Cafés Calientes", nombre: "Latte Clásico", precio: 8500, stock: 40, estado: "Activo", emoji: "☕" },
  { id: 2, categoria: "Cafés Calientes", nombre: "Cappuccino Italiano", precio: 9000, stock: 32, estado: "Activo", emoji: "☕" },
  { id: 3, categoria: "Cafés Calientes", nombre: "Espresso Doble", precio: 6000, stock: 60, estado: "Activo", emoji: "☕" },
  { id: 4, categoria: "Cafés Calientes", nombre: "Matcha Latte", precio: 11000, stock: 18, estado: "Activo", emoji: "🍵" },
  { id: 5, categoria: "Bebidas Frías", nombre: "Frappuccino Caramelo", precio: 12500, stock: 25, estado: "Activo", emoji: "🥤" },
  { id: 6, categoria: "Bebidas Frías", nombre: "Cold Brew Vainilla", precio: 10500, stock: 22, estado: "Activo", emoji: "🥤" },
  { id: 7, categoria: "Postres", nombre: "Muffin de Arándanos", precio: 5500, stock: 15, estado: "Activo", emoji: "🧁" },
  { id: 8, categoria: "Postres", nombre: "Cheesecake de Frutos Rojos", precio: 9500, stock: 8, estado: "Activo", emoji: "🍰" },
  { id: 9, categoria: "Postres", nombre: "Brownie de Chocolate", precio: 6500, stock: 12, estado: "Activo", emoji: "🍫" },
  { id: 10, categoria: "Panadería", nombre: "Croissant de Mantequilla", precio: 4500, stock: 30, estado: "Activo", emoji: "🥐" },
  { id: 11, categoria: "Snacks", nombre: "Cookies de Chocolate", precio: 3500, stock: 50, estado: "Activo", emoji: "🍪" },
  { id: 12, categoria: "Snacks", nombre: "Donuts Glaseadas", precio: 4000, stock: 28, estado: "Inactivo", emoji: "🍩" },
];

const formatoCOP = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

export default function ProductosPage() {
  const [productos, setProductos] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState<"nuevo" | "editar" | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const guardarProducto = (datos: Omit<Producto, "id">) => {
    if (modalAbierto === "editar" && productoSeleccionado) {
      setProductos((prev) =>
        prev.map((p) => (p.id === productoSeleccionado.id ? { ...p, ...datos } : p))
      );
    } else {
      setProductos((prev) => [...prev, { id: Math.max(0, ...prev.map((p) => p.id)) + 1, ...datos }]);
    }
    setModalAbierto(null);
    setProductoSeleccionado(null);
  };

  const handleEdit = (producto: Producto) => {
      setProductoSeleccionado(producto);
      setModalAbierto("editar");
    }
  
    const handleDelete = (producto: Producto) => {
      setProductoAEliminar(producto);
    }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <EncabezadoSeccion
          icon={Coffee}
          titulo="Productos"
          subtitulo="Catálogo de productos de la cafetería"
          accion={
            <button
              onClick={() => setModalAbierto("nuevo")}
              className="flex items-center gap-2 rounded-lg bg-[#16123f] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              <Plus size={16} />
              Nuevo Producto
            </button>
          }
        />
        <TableAroma 
        headers={["ID", "Categoría", "Nombre", "Precio", "Stock", "Estado", "Acciones"]}
        data={productosFiltrados}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleSearch={setBusqueda}
        searchValue={busqueda}
        />

      </main>

      {modalAbierto && (
        <ModalProducto
          producto={productoSeleccionado ?? undefined}
          onClose={() => {
            setModalAbierto(null);
            setProductoSeleccionado(null);
          }}
          onGuardar={guardarProducto}
        />
      )}

      {productoAEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar Producto"
          nombre={productoAEliminar.nombre}
          onCancelar={() => setProductoAEliminar(null)}
          onConfirmar={() => {
            setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id));
            setProductoAEliminar(null);
          }}
        />
      )}
    </div>
  );
}