"use client";

// 1. Quitamos 'Image' de aquí arriba
import { Card, Button } from "@heroui/react";

interface IProductCard {
  nombre: string;
  precio: number;
  imagenUrl?: string;
}

export default function Cartadeproducto({ nombre, precio, imagenUrl }: IProductCard) {
  return (
    // 2. Cambiamos w-[200px] por w-50 como sugiere Tailwind
    <Card className="w-50 shadow-sm border border-gray-100 p-2">
      
      <div className="flex justify-center bg-gray-50 rounded-lg overflow-hidden h-32 mb-2">
        {imagenUrl ? (
          // 3. Usamos la etiqueta clásica <img> de HTML
          <img src={imagenUrl} alt={nombre} className="object-cover h-full w-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">Sin imagen</div>
        )}
      </div>

      <div className="flex flex-col gap-1 px-1">
        <h4 className="font-bold text-sm text-[#16123f] truncate">{nombre}</h4>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-semibold text-gray-700">${precio}</span>
          <Button size="sm" className="bg-[#16123f] text-white font-bold h-7 px-3 rounded-md">
            + Agregar
          </Button>
        </div>
      </div>
    </Card>
  );
}