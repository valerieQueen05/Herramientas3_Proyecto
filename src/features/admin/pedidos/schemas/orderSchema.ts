import { z } from "zod";

export const createOrderSchema = z.object({
  direccion: z
    .string()
    .trim()
    .min(5, "Ingresa una dirección de entrega válida (mínimo 5 caracteres)")
    .max(200, "La dirección no puede superar los 200 caracteres"),
  items: z
    .array(
      z.object({
        productoId: z.number().int().positive("Producto inválido"),
        cantidad: z.number().int().positive("La cantidad debe ser mayor a 0"),
      })
    )
    .min(1, "Debes agregar al menos un producto al pedido"),
});

export const updateOrderStatusSchema = z.object({
  estado: z.enum(["SOLICITADO", "PENDIENTE", "ENTREGADO", "CANCELADO"]),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
