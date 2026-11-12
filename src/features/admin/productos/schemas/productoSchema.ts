import { z } from "zod";

// Los inputs numéricos y el select de categoría usan valueAsNumber:
// si están vacíos llegan como NaN y fallan aquí
export const productoSchema = z.object({
  categoriaId: z
    .number({ error: "Selecciona una categoría" })
    .int()
    .positive("Selecciona una categoría"),
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(80, "El nombre no puede superar los 80 caracteres"),
  descripcion: z.string().trim().max(250, "La descripción no puede superar los 250 caracteres"),
  precioCompra: z
    .number({ error: "Ingresa un precio válido" })
    .positive("El precio debe ser mayor a 0"),
  precioVenta: z
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
