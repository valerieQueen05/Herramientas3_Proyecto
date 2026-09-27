"use client";

import { useState } from "react";
// 1. Agregamos ShoppingBag a la importación
import { Search, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

// 2. Definimos exactamente qué es un Producto para que TypeScript esté feliz
type Producto = {
  id: number;
  nombre: string;
  precioNum: number;
  categoria: string;
  img: string;
};

// Y definimos qué es un ítem dentro del carrito (es un Producto + su cantidad)
type ItemCarrito = Producto & {
  cantidad: number;
};

const catalogoCompleto: Producto[] = [
  { id: 1, nombre: "Latte de Vainilla", precioNum: 3.50, categoria: "Cafés Calientes", img: "☕" },
  { id: 2, nombre: "Cappuccino Clásico", precioNum: 3.25, categoria: "Cafés Calientes", img: "☕" },
  { id: 3, nombre: "Espresso Doble", precioNum: 2.50, categoria: "Cafés Calientes", img: "☕" },
  { id: 4, nombre: "Frappuccino Mocha", precioNum: 4.75, categoria: "Bebidas Frías", img: "🧋" },
  { id: 5, nombre: "Matcha Latte", precioNum: 4.25, categoria: "Bebidas Frías", img: "🍵" },
  { id: 6, nombre: "Muffin de Chocolate", precioNum: 2.00, categoria: "Postres", img: "🧁" },
];

export default function SolicitarUsuario() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  // 3. Reemplazamos <any[]> con <ItemCarrito[]>
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const productosFiltrados = categoriaActiva === "Todos" 
    ? catalogoCompleto 
    : catalogoCompleto.filter(prod => prod.categoria === categoriaActiva);

  // 4. Reemplazamos "producto: any" con "producto: Producto"
  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const modificarCantidad = (id: number, operacion: "sumar" | "restar") => {
    setCarrito(carrito.map(item => {
      if (item.id === id) {
        const nuevaCantidad = operacion === "sumar" ? item.cantidad + 1 : item.cantidad - 1;
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    }).filter(item => item.cantidad > 0)); 
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  const precioTotal = carrito.reduce((total, item) => total + (item.precioNum * item.cantidad), 0);

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div className="flex-1 w-full flex flex-col gap-6">
        
        <div className="relative w-full">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-white rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#75c9b7] text-sm shadow-sm text-[#16123f]"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide text-sm font-medium">
          {["Todos", "Cafés Calientes", "Bebidas Frías", "Postres"].map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-5 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors ${
                categoriaActiva === cat 
                  ? "bg-[#75c9b7] text-[#16123f]" 
                  : "bg-white text-gray-500 hover:text-[#16123f] hover:bg-gray-50"
              }`}
            >
              {cat === "Todos" ? "☕" : cat === "Cafés Calientes" ? "☕" : cat === "Bebidas Frías" ? "🥤" : "🍰"} {cat}
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#16123f] mb-4">Catálogo</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {productosFiltrados.map((prod) => (
              <div key={prod.id} className="bg-white p-3 rounded-3xl shadow-sm flex flex-col">
                <div className="bg-[#e8f4ec] h-32 rounded-2xl flex items-center justify-center text-5xl mb-3">
                  {prod.img}
                </div>
                <h3 className="font-bold text-[#16123f] text-sm leading-tight px-1">{prod.nombre}</h3>
                <div className="flex items-center justify-between mt-4 px-1 pb-1">
                  <span className="text-[#75c9b7] font-bold">${prod.precioNum.toFixed(2)}</span>
                  <button 
                    onClick={() => agregarAlCarrito(prod)}
                    className="bg-[#16123f] text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-[#2a235f] transition-colors"
                  >
                    <Plus size={14} /> Agregar
                  </button>
                </div>
              </div>
            ))}
            
            {productosFiltrados.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                No hay productos en esta categoría.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: RESUMEN DEL PEDIDO */}
      {/* 5. Ajuste sugerido por Tailwind: xl:w-87.5 */}
      <div className="w-full xl:w-87.5 bg-white rounded-3xl p-6 shadow-sm flex flex-col sticky top-6">
        <h2 className="text-xl font-bold text-[#16123f] mb-6">Resumen del Pedido</h2>
        
        <div className="flex flex-col gap-3 mb-8 flex-1">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-10 opacity-50">
               <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-3">
                 <ShoppingBag className="text-gray-400" size={24} />
               </div>
               <p className="text-gray-500 text-sm">Tu pedido está vacío.<br/>Agrega productos del catálogo.</p>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-[#e8f4ec] p-3 rounded-2xl relative group">
                <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm">{item.img}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#16123f] leading-tight pr-6">{item.nombre}</h4>
                  <span className="text-xs text-gray-500 font-medium mt-0.5 block">${item.precioNum.toFixed(2)} c/u</span>
                </div>
                
                <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl shadow-sm">
                  <Minus onClick={() => modificarCantidad(item.id, "restar")} size={14} className="text-gray-400 hover:text-[#16123f] cursor-pointer transition-colors" />
                  <span className="text-xs font-bold text-[#16123f] w-3 text-center">{item.cantidad}</span>
                  <Plus onClick={() => modificarCantidad(item.id, "sumar")} size={14} className="text-[#16123f] hover:text-[#75c9b7] cursor-pointer transition-colors" />
                </div>

                <button 
                  onClick={() => eliminarDelCarrito(item.id)}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-500 font-medium">Cantidad de productos</span>
            <span className="font-bold text-[#16123f]">{cantidadTotal}</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-500 font-medium">Total</span>
            <span className="text-2xl font-bold text-[#16123f]">${precioTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={carrito.length === 0}
            className={`w-full font-bold py-4 rounded-2xl transition-colors shadow-sm text-sm ${
              carrito.length > 0 
                ? "bg-[#75c9b7] text-[#16123f] hover:bg-[#5eb5a3]" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>

    </div>
  );
}