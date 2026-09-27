"use client";

import { useState } from "react";
import { Coffee, Plus, Pencil, Trash2 } from "lucide-react";
import Navbar from "../../../componentes/Barralateral";
import EncabezadoSeccion from "../../../componentes/EncabezadoSeccion";
import Buscador from "../../../componentes/Buscador";
import Badge from "../../../componentes/Badge";
import ModalProducto, { Producto } from "../../../componentes/ModalProducto";
import ModalConfirmarEliminar from "../../../componentes/ModalConfirmarEliminar";

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

        <Buscador placeholder="Buscar producto o categoría..." value={busqueda} onChange={setBusqueda} />

        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Categoría</th>
                <th className="px-6 py-3 font-medium">Nombre</th>
                <th className="px-6 py-3 font-medium">Precio</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-6 py-3 text-gray-400">#{p.id}</td>
                  <td className="px-6 py-3 text-gray-500">{p.categoria}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-lg">
                        {p.emoji}
                      </span>
                      <span className="font-medium text-gray-900">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{formatoCOP(p.precio)}</td>
                  <td className={`px-6 py-3 font-medium ${p.stock <= 15 ? "text-amber-600" : "text-gray-700"}`}>
                    {p.stock}
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={p.estado.toLowerCase() as "activo" | "inactivo"} label={p.estado} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button
                        onClick={() => {
                          setProductoSeleccionado(p);
                          setModalAbierto("editar");
                        }}
                        className="transition hover:text-[#16123f]"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setProductoAEliminar(p)}
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