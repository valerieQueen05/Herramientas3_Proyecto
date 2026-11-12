"use client";

import { useCallback, useEffect, useState } from "react";
import { Coffee, Plus } from "lucide-react";
import Navbar from "@/src/commons/components/Barralateral";
import EncabezadoSeccion from "@/src/commons/components/EncabezadoSeccion";
import ModalProducto, { Producto } from "@/src/features/admin/productos/components/ModalProducto";
import ModalConfirmarEliminar from "@/src/commons/components/ModalConfirmarEliminar";
import TableAroma from "@/src/commons/components/TableAroma";
import { apiFetch } from "@/src/commons/utils/api";
import { ProductList } from "@/src/features/admin/productos/domain/product.entity";

const formatoCOP = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

// La API devuelve los campos de la BD (titulo, activo...); la tabla y el modal usan (nombre, estado...)
const toProducto = (p: ProductList): Producto => ({
  id: p.id,
  nombre: p.titulo,
  descripcion: p.descripcion ?? "",
  categoriaId: p.categoriaId,
  categoria: p.categoria.titulo,
  precioCompra: p.precioCompra,
  precioVenta: p.precioVenta,
  precio: formatoCOP(p.precioVenta),
  stock: p.stock,
  estado: p.activo ? "Activo" : "Inactivo",
  emoji: p.imagen ?? "☕",
});

const obtenerProductos = async () => {
  const res = await apiFetch<{ data: ProductList[] }>("/api/product");
  return res.data.map(toProducto);
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState<"nuevo" | "editar" | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [notificacion, setNotificacion] = useState<{
    mensaje: string;
    tipo: "success" | "error" | "loading";
  } | null>(null);

  const cargarProductos = useCallback(() => {
    obtenerProductos()
      .then(setProductos)
      .catch((error) =>
        setNotificacion({
          mensaje: error instanceof Error ? error.message : "Error al cargar los productos",
          tipo: "error",
        })
      );
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  useEffect(() => {
    if (!notificacion || notificacion.tipo === "loading") return;

    const timeout = setTimeout(() => setNotificacion(null), 4000);
    return () => clearTimeout(timeout);
  }, [notificacion]);

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // El modal ya guardó en la API; aquí solo cerramos y recargamos la lista
  const guardarProducto = () => {
    setModalAbierto(null);
    setProductoSeleccionado(null);
    cargarProductos();
  };

  const eliminarProducto = async (producto: Producto) => {
    try {
      setNotificacion({ mensaje: "Eliminando...", tipo: "loading" });
      const res = await apiFetch<{ message: string }>(`/api/product/${producto.id}`, {
        method: "DELETE",
      });
      setNotificacion({ mensaje: res.message, tipo: "success" });
      cargarProductos();
    } catch (error) {
      setNotificacion({
        mensaje: error instanceof Error ? error.message : "Error al eliminar",
        tipo: "error",
      });
    } finally {
      setProductoAEliminar(null);
    }
  };

  const handleEdit = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto("editar");
  };

  const handleDelete = (producto: Producto) => {
    setProductoAEliminar(producto);
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
        {/* El orden de los headers sigue el orden en que TableAroma pinta las columnas */}
        <TableAroma
          headers={["ID", "Nombre", "Precio", "Stock", "Categoría", "Estado", "Acciones"]}
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
          onNotificar={(mensaje, tipo) => setNotificacion({ mensaje, tipo })}
        />
      )}

      {productoAEliminar && (
        <ModalConfirmarEliminar
          titulo="Eliminar Producto"
          nombre={productoAEliminar.nombre}
          onCancelar={() => setProductoAEliminar(null)}
          onConfirmar={() => eliminarProducto(productoAEliminar)}
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
