"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import Modal from "@/src/commons/components/Modal";
import CampoError from "@/src/commons/components/CampoError";
import { apiFetch } from "@/src/commons/utils/api";
import {
  productoSchema,
  ProductoFormData,
} from "@/src/features/admin/productos/schemas/productoSchema";
import { CategoryList } from "@/src/features/admin/categorias/domain/category.entity";

// Así se ve un producto en la tabla (nombres del formulario, no de la BD)
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoriaId: number;
  categoria: string;
  precioCompra: number;
  precioVenta: number;
  precio: string; // precio de venta con formato, solo para mostrarlo en la tabla
  stock: number;
  estado: "Activo" | "Inactivo";
  emoji: string;
}

interface ModalProductoProps {
  producto?: Producto;
  onClose: () => void;
  onGuardar: () => void;
  onNotificar?: (mensaje: string, tipo: "success" | "error" | "loading") => void;
}

export default function ModalProducto({ producto, onClose, onGuardar, onNotificar }: ModalProductoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      categoriaId: producto?.categoriaId,
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precioCompra: producto?.precioCompra,
      precioVenta: producto?.precioVenta,
      stock: producto?.stock,
      estado: producto?.estado ?? "Activo",
      emoji: producto?.emoji ?? "☕",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<CategoryList[]>([]);

  // Las opciones del select vienen de la API de categorías (solo las activas)
  useEffect(() => {
    apiFetch<{ data: CategoryList[] }>("/api/category")
      .then((res) => {
        setCategorias(res.data.filter((c) => c.activo));
        // Al editar, esperamos a tener las opciones para dejar marcada la categoría del producto
        if (producto) setValue("categoriaId", producto.categoriaId);
      })
      .catch((error) => console.error("No se pudieron cargar las categorías:", error));
  }, [producto, setValue]);

  const onSubmit = async (data: ProductoFormData) => {
    try {
      setIsSubmitting(true);
      onNotificar?.("Guardando...", "loading");

      // Crear = POST /api/product  |  Editar = PATCH /api/product/:id
      const method = producto ? "PATCH" : "POST";
      const url = producto ? `/api/product/${producto.id}` : "/api/product";

      // apiFetch lanza un error si el status no es 2xx, así que si llega aquí salió bien
      const res = await apiFetch<{ message: string }>(url, { method, body: data });

      onNotificar?.(res.message, "success");
      onGuardar();
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      onNotificar?.(error instanceof Error ? error.message : "Error al guardar", "error");
    } finally {
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
            <select className={inputClass} {...register("categoriaId", { valueAsNumber: true })}>
              <option value="">Selecciona...</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titulo}
                </option>
              ))}
            </select>
            <CampoError mensaje={errors.categoriaId?.message} />
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

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Precio compra</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("precioCompra", { valueAsNumber: true })}
            />
            <CampoError mensaje={errors.precioCompra?.message} />
          </div>
          <div>
            <label className={labelClass}>Precio venta</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              {...register("precioVenta", { valueAsNumber: true })}
            />
            <CampoError mensaje={errors.precioVenta?.message} />
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
