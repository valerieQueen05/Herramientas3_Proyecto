"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/src/commons/components/Modal";
import CampoError from "@/src/commons/components/CampoError";
import { apiFetch } from "@/src/commons/utils/api";
import {
  categoriaSchema,
  CategoriaFormData,
} from "@/src/features/admin/categorias/schemas/categoriaSchema";

export interface Categoria {
  id: number;
  nombre: string;
  estado: "Activo" | "Inactivo";
}

interface ModalCategoriaProps {
  categoria?: Categoria;
  onClose: () => void;
  onGuardar: (categoria: Omit<Categoria, "id">) => void;
}

export default function ModalCategoria({
  categoria,
  onClose,
  onGuardar,
}: ModalCategoriaProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      estado: categoria?.estado ?? "Activo",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

   const onSubmit = async (data: CategoriaFormData) => {
  try {
    setIsSubmitting(true);
    const method = "POST";
    const url = categoria ? `/api/categorias/${categoria.id}` : "/api/categorias";

    const res = await apiFetch<{message: boolean}>(url, {
      method,
      body: data
    });
    
    if (res.message) {
      alert ("OK");
      onGuardar(data);
    }
    else alert ("BAD");

    //console.log("---------");
    //console.log(res);
    //console.log("---------");
  }
  catch (error) {
    console.error("Error al guardar la categoría:", error);

  }
  finally {
    setIsSubmitting(false);
  }
  };

  const esEdicion = Boolean(categoria);

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <Modal
      title={esEdicion ? "Editar Categoría" : "Nueva Categoría"}
      onClose={onClose}
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
            form="form-categoria"
            disabled={isSubmitting}
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : esEdicion ? "Guardar Cambios" : "Crear Categoría"}
          </button>
        </>
      }
    >
      <form id="form-categoria" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <input className={inputClass} placeholder="Ej: Cafés Calientes" {...register("nombre")} />
          <CampoError mensaje={errors.nombre?.message} />
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select className={inputClass} {...register("estado")}>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
          <CampoError mensaje={errors.estado?.message} />
        </div>
      </form>
    </Modal>
  );
}

