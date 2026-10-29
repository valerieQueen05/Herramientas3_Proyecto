"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Modal from "@/src/commons/components/Modal";
import CampoError from "@/src/commons/components/CampoError";
import {
  productoSchema,
  ProductoFormData,
} from "@/src/features/admin/productos/schemas/productoSchema";

export interface Producto {
  id: number;
  categoria: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  estado: "Activo" | "Inactivo";
  emoji: string;
}

const categoriasDisponibles = ["Cafés Calientes", "Bebidas Frías", "Postres", "Panadería", "Snacks"];

interface ModalProductoProps {
  producto?: Producto;
  onClose: () => void;
  onGuardar: (producto: Omit<Producto, "id">) => void;
}

export default function ModalProducto({ producto, onClose, onGuardar }: ModalProductoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      categoria: producto?.categoria ?? categoriasDisponibles[0],
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio: producto?.precio,
      stock: producto?.stock,
      estado: producto?.estado ?? "Activo",
      emoji: producto?.emoji ?? "☕",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ProductoFormData) => {
    try {
      setIsSubmitting(true);
      // TODO: aquí va la llamada a la API (apiFetch) cuando exista la ruta de productos
      onGuardar(data);
    }
    catch (error) {
      console.error("Error al guardar el producto:", error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const emoji = watch("emoji");
  const esEdicion = Boolean(producto);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <Modal
      title={esEdicion ? "Editar Producto" : "Nuevo Producto"}
      onClose={onClose}
      maxWidthClass="max-w-lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-producto"
            disabled={isSubmitting}
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Crear Producto"}
          </button>
        </>
      }
    >
      <form id="form-producto" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Categoría</label>
            <select className={inputClass} {...register("categoria")}>
              {categoriasDisponibles.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <CampoError mensaje={errors.categoria?.message} />
          </div>
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} {...register("nombre")} />
            <CampoError mensaje={errors.nombre?.message} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Descripción</label>
          <textarea
            className={`${inputClass} min-h-17.5 resize-none`}
            placeholder="Ej: Espresso suave con leche vaporizada y arte en la espuma."
            {...register("descripcion")}
          />
          <CampoError mensaje={errors.descripcion?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Precio (COP)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("precio", { valueAsNumber: true })}
            />
            <CampoError mensaje={errors.precio?.message} />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("stock", { valueAsNumber: true })}
            />
            <CampoError mensaje={errors.stock?.message} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Estado</label>
          <select className={inputClass} {...register("estado")}>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
          <CampoError mensaje={errors.estado?.message} />
        </div>

        <div>
          <label className={labelClass}>Icono del producto</label>
          <div className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-lg bg-gray-50 text-2xl">
              {emoji}
              <button
                type="button"
                onClick={() => setValue("emoji", "", { shouldValidate: true })}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                aria-label="Quitar icono"
              >
                <X size={12} />
              </button>
            </div>
            <label className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 py-4 text-xs text-gray-400 transition hover:border-[#16123f] hover:text-[#16123f]">
              <Upload size={16} />
              Elige un emoji representativo
              <input
                type="text"
                maxLength={2}
                className="sr-only"
                onChange={(e) => setValue("emoji", e.target.value, { shouldValidate: true })}
              />
            </label>
          </div>
          <CampoError mensaje={errors.emoji?.message} />
        </div>
      </form>
    </Modal>
  );
}
