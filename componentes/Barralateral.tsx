"use client"; // Le indica a Next.js que este componente usa interactividad (clics)

import { useState } from "react";
import Link from "next/link";
// Importamos iconos de react-icons
import { PiList, PiX, PiCoffee, PiUsers, PiHouse } from "react-icons/pi"; 

export default function Sidebar() {
  // useState crea nuestro "interruptor" para abrir/cerrar el menú
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {/* BOTÓN FLOTANTE PARA ABRIR EL MENÚ */}
      {/* Usamos el color Mint (#c7ddcc) para el botón y Navy (#16123f) para el icono */}
      <button 
        onClick={() => setAbierto(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-[#c7ddcc] text-[#16123f] rounded-md shadow-md"
      >
        <PiList size={24} />
      </button>

      {/* FONDO OSCURO (Aparece cuando el menú está abierto) */}
      {abierto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setAbierto(false)} // Si tocas fuera del menú, se cierra
        />
      )}

      {/* EL MENÚ LATERAL EN SÍ */}
      {/* bg-[#16123f] aplica el color Navy oficial del PDF */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#16123f] text-white z-50 transform transition-transform duration-300 ${abierto ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Encabezado del menú con el logo y el botón de cerrar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-[#75c9b7]">Café Aroma</h2> {/* Color Teal */}
          <button onClick={() => setAbierto(false)} className="text-white hover:text-[#ffe26a]">
            <PiX size={24} />
          </button>
        </div>

        {/* Lista de enlaces de navegación */}
        <ul className="flex flex-col p-4 gap-2">
          <li>
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#75c9b7] hover:text-[#16123f] transition-colors">
              <PiHouse size={20} /> Inicio
            </Link>
          </li>
          <li>
            <Link href="/productos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#75c9b7] hover:text-[#16123f] transition-colors">
              <PiCoffee size={20} /> Productos
            </Link>
          </li>
          <li>
            <Link href="/usuarios" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#75c9b7] hover:text-[#16123f] transition-colors">
              <PiUsers size={20} /> Usuarios
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}