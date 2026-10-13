import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  estado: z.enum(["Activo", "Inactivo"]),
});

export type CategoriaFormData = z.infer<typeof categoriaSchema>;
