"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/src/commons/components/Modal";
import CampoError from "@/src/commons/components/CampoError";
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

  const onSubmit = (data: CategoriaFormData) => {
  try {
    setIsSubmitting(true);
    const method = "POST";
    const url = categoria ? `/api/categorias/${categoria.id}` : "/api/categorias";
    
    console.log("---------");
    console.log(data);
    console.log("---------");
  }
  catch (error) {
    console.error("Error al guardar la categoría:", error);

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
            className="rounded-lg bg-[#16123f] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {esEdicion ? "Guardar Cambios" : "Crear Categoría"}
          </button>
        </>
      }
    >
      <form id="form-categoria" onSubmit={handleSubmit(onGuardar)} className="flex flex-col gap-4">
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
function setIsSubmitting(arg0: boolean) {
  throw new Error("Function not implemented.");
}

