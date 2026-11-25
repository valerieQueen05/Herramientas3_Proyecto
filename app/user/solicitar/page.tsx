"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Minus, Trash2, ShoppingBag, Coffee, MapPin } from "lucide-react";
import { apiFetch } from "@/src/commons/utils/api";
import { formatoCOP } from "@/src/commons/lib/pedidosData";
import { ProductList } from "@/src/features/admin/productos/domain/product.entity";
import { CategoryList } from "@/src/features/admin/categorias/domain/category.entity";

type ProductoCatalogo = {
  id: number;
  nombre: string;
  descripcion: string;
  precioNum: number;
  stock: number;
  categoriaId: number;
  categoria: string;
  imagen: string | null;
};

type ItemCarrito = ProductoCatalogo & {
  cantidad: number;
};

const toCatalogo = (p: ProductList): ProductoCatalogo => ({
  id: p.id,
  nombre: p.titulo,
  descripcion: p.descripcion ?? "",
  precioNum: p.precioVenta,
  stock: p.stock,
  categoriaId: p.categoriaId,
  categoria: p.categoria.titulo,
  imagen: p.imagen?.startsWith("https://") ? p.imagen : null,
});

export default function SolicitarUsuario() {
  const [productos, setProductos] = useState<ProductoCatalogo[]>([]);
  const [categorias, setCategorias] = useState<CategoryList[]>([]);
  const [cargando, setCargando] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [direccion, setDireccion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipo: "success" | "error";
    mensaje: string;
  } | null>(null);

  const cargarCatalogo = useCallback(() => {
    Promise.all([
      apiFetch<{ data: ProductList[] }>("/api/product"),
      apiFetch<{ data: CategoryList[] }>("/api/category"),
    ])
      .then(([resProd, resCat]) => {
        const lista = resProd.data.map(toCatalogo);
        setProductos(lista);
        setCategorias(resCat.data);

        // Si viene desde "Volver a pedir", precargamos los productos disponibles en el carrito
        const reorderRaw = sessionStorage.getItem("cafe_aroma_reorder");
        if (reorderRaw) {
          sessionStorage.removeItem("cafe_aroma_reorder");
          try {
            const items = JSON.parse(reorderRaw) as { productoId: number; cantidad: number }[];
            const precargados: ItemCarrito[] = [];
            for (const item of items) {
              const prod = lista.find((p) => p.id === item.productoId && p.stock > 0);
              if (prod) {
                precargados.push({
                  ...prod,
                  cantidad: Math.min(item.cantidad, prod.stock),
                });
              }
            }
            if (precargados.length > 0) {
              setCarrito(precargados);
            }
          } catch {
            // Si falla el parseo, ignoramos la precarga
          }
        }
      })
      .catch((err) =>
        setFeedback({
          tipo: "error",
          mensaje: err instanceof Error ? err.message : "Error al cargar el catálogo",
        })
      )
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    cargarCatalogo();
  }, [cargarCatalogo]);

  const productosFiltrados = productos.filter((prod) => {
    const coincideCategoria =
      categoriaActiva === "Todos" || prod.categoria === categoriaActiva;
    const q = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      !q ||
      prod.nombre.toLowerCase().includes(q) ||
      prod.descripcion.toLowerCase().includes(q) ||
      prod.categoria.toLowerCase().includes(q);
    return coincideCategoria && coincideBusqueda;
  });

  const agregarAlCarrito = (producto: ProductoCatalogo) => {
    if (producto.stock <= 0) return;
    setFeedback(null);

    const itemExistente = carrito.find((item) => item.id === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stock) return;
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const modificarCantidad = (id: number, operacion: "sumar" | "restar") => {
    setCarrito(
      carrito
        .map((item) => {
          if (item.id !== id) return item;
          if (operacion === "sumar") {
            return { ...item, cantidad: Math.min(item.cantidad + 1, item.stock) };
          }
          return { ...item, cantidad: item.cantidad - 1 };
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const finalizarPedido = async () => {
    if (carrito.length === 0) return;
    if (direccion.trim().length < 5) {
      setFeedback({
        tipo: "error",
        mensaje: "Ingresa una dirección de entrega válida (mínimo 5 caracteres).",
      });
      return;
    }

    try {
      setEnviando(true);
      setFeedback(null);

      const res = await apiFetch<{ message: string; data: { id: number } }>("/api/order", {
        method: "POST",
        body: {
          direccion: direccion.trim(),
          items: carrito.map((item) => ({
            productoId: item.id,
            cantidad: item.cantidad,
          })),
        },
      });

      setCarrito([]);
      setDireccion("");
      setFeedback({
        tipo: "success",
        mensaje: `${res.message} (Orden #${res.data.id}).`,
      });
      window.dispatchEvent(new Event("orders-updated"));
      cargarCatalogo();
    } catch (err) {
      setFeedback({
        tipo: "error",
        mensaje: err instanceof Error ? err.message : "Error al realizar el pedido",
      });
    } finally {
      setEnviando(false);
    }
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  const precioTotal = carrito.reduce((total, item) => total + item.precioNum * item.cantidad, 0);

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar productos o categorías..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#75c9b7] text-sm shadow-sm text-[#16123f]"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide text-sm font-medium">
          {["Todos", ...categorias.map((c) => c.titulo)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors cursor-pointer ${
                categoriaActiva === cat
                  ? "bg-[#75c9b7] text-[#16123f]"
                  : "bg-white text-gray-500 hover:text-[#16123f] hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#16123f] mb-4">Catálogo</h2>

          {cargando ? (
            <p className="text-sm text-gray-400">Cargando catálogo...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {productosFiltrados.map((prod) => {
                const enCarrito = carrito.find((c) => c.id === prod.id)?.cantidad ?? 0;
                const sinStock = prod.stock <= 0;
                const limiteAlcanzado = enCarrito >= prod.stock;

                return (
                  <div key={prod.id} className="bg-white p-3 rounded-3xl shadow-sm flex flex-col">
                    <div className="relative bg-[#e8f4ec] h-32 rounded-2xl flex items-center justify-center overflow-hidden mb-3">
                      {prod.imagen ? (
                        <Image
                          src={prod.imagen}
                          alt={prod.nombre}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <Coffee className="text-[#16123f]/50" size={36} />
                      )}
                    </div>

                    <div className="px-1 flex-1">
                      <span className="text-[11px] font-medium text-gray-400">
                        {prod.categoria}
                      </span>
                      <h3 className="font-bold text-[#16123f] text-sm leading-tight mt-0.5">
                        {prod.nombre}
                      </h3>
                      {prod.descripcion && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {prod.descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 px-1 pb-1 gap-2">
                      <div>
                        <span className="text-[#16123f] font-bold block">
                          {formatoCOP(prod.precioNum)}
                        </span>
                        <span
                          className={`text-[11px] ${
                            sinStock ? "text-red-500 font-medium" : "text-gray-400"
                          }`}
                        >
                          {sinStock ? "Agotado" : `Stock: ${prod.stock}`}
                        </span>
                      </div>

                      <button
                        onClick={() => agregarAlCarrito(prod)}
                        disabled={sinStock || limiteAlcanzado}
                        className="bg-[#16123f] text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-[#2a235f] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Plus size={14} /> Agregar
                      </button>
                    </div>
                  </div>
                );
              })}

              {productosFiltrados.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No hay productos disponibles con ese filtro.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN DERECHA: RESUMEN DEL PEDIDO */}
      <div className="w-full xl:w-96 bg-white rounded-3xl p-6 shadow-sm flex flex-col sticky top-6">
        <h2 className="text-xl font-bold text-[#16123f] mb-6">Resumen del Pedido</h2>

        {feedback && (
          <div
            role="status"
            className={`mb-4 rounded-2xl px-4 py-3 text-xs font-medium ${
              feedback.tipo === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            <p>{feedback.mensaje}</p>
            {feedback.tipo === "success" && (
              <Link
                href="/user/pedidos"
                className="inline-block mt-1.5 font-bold underline"
              >
                Ver mis pedidos
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6 flex-1 max-h-80 overflow-y-auto pr-1">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-10 opacity-50">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500 text-sm">
                Tu pedido está vacío.
                <br />
                Agrega productos del catálogo.
              </p>
            </div>
          ) : (
            carrito.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-[#e8f4ec] p-3 rounded-2xl relative group"
              >
                <div className="relative bg-white w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                  {item.imagen ? (
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <Coffee className="text-[#16123f]/60" size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#16123f] leading-tight truncate pr-4">
                    {item.nombre}
                  </h4>
                  <span className="text-xs text-gray-500 font-medium mt-0.5 block">
                    {formatoCOP(item.precioNum)} c/u
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl shadow-sm">
                  <button
                    type="button"
                    onClick={() => modificarCantidad(item.id, "restar")}
                    aria-label="Disminuir cantidad"
                    className="text-gray-400 hover:text-[#16123f] cursor-pointer transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-xs font-bold text-[#16123f] w-4 text-center">
                    {item.cantidad}
                  </span>
                  <button
                    type="button"
                    onClick={() => modificarCantidad(item.id, "sumar")}
                    disabled={item.cantidad >= item.stock}
                    aria-label="Aumentar cantidad"
                    className="text-[#16123f] hover:text-[#75c9b7] cursor-pointer transition-colors disabled:opacity-40"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarDelCarrito(item.id)}
                  aria-label="Quitar producto"
                  className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 pt-5">
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mb-1.5">
              <MapPin size={14} /> Dirección de entrega
            </label>
            <input
              type="text"
              placeholder="Ej: Calle 72 # 11-30, Chapinero"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full bg-[#f0f7f4] rounded-xl px-3.5 py-2.5 text-sm text-[#16123f] outline-none focus:ring-2 focus:ring-[#75c9b7]"
            />
          </div>

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-500 font-medium">Cantidad de productos</span>
            <span className="font-bold text-[#16123f]">{cantidadTotal}</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500 font-medium">Total</span>
            <span className="text-2xl font-bold text-[#16123f]">{formatoCOP(precioTotal)}</span>
          </div>
          <button
            type="button"
            disabled={carrito.length === 0 || enviando}
            onClick={finalizarPedido}
            className={`w-full font-bold py-4 rounded-2xl transition-colors shadow-sm text-sm ${
              carrito.length > 0 && !enviando
                ? "bg-[#75c9b7] text-[#16123f] hover:bg-[#5eb5a3] cursor-pointer"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {enviando ? "Enviando pedido..." : "Finalizar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
