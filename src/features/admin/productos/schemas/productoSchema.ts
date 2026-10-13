import { z } from "zod";

export const productoSchema = z.object({
  categoria: z.string().min(1, "Selecciona una categoría"),
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(80, "El nombre no puede superar los 80 caracteres"),
  descripcion: z.string().trim().max(250, "La descripción no puede superar los 250 caracteres"),
  // Los inputs numéricos usan valueAsNumber: si están vacíos llegan como NaN y fallan aquí
  precio: z
    .number({ error: "Ingresa un precio válido" })
    .positive("El precio debe ser mayor a 0"),
  stock: z
    .number({ error: "Ingresa un stock válido" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
  estado: z.enum(["Activo", "Inactivo"]),
  emoji: z.string().min(1, "Elige un icono para el producto"),
});

export type ProductoFormData = z.infer<typeof productoSchema>;
