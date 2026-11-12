import { z } from "zod";

// Al crear, la contraseña es obligatoria; al editar, vacía significa "no cambiarla".
// Por eso es una función: crearUsuarioSchema(false) para crear, crearUsuarioSchema(true) para editar.
export const crearUsuarioSchema = (esEdicion: boolean) =>
  z
    .object({
      nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(80, "El nombre no puede superar los 80 caracteres"),
      apellido: z
        .string()
        .trim()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(80, "El apellido no puede superar los 80 caracteres"),
      email: z.email("Ingresa un correo válido"),
      rol: z.enum(["Administrador", "Administrativo", "Mensajero", "Cliente"]),
      estado: z.enum(["Activo", "Inactivo"]),
      contrasena: z.string(),
      confirmarContrasena: z.string(),
    })
    .superRefine(({ contrasena, confirmarContrasena }, ctx) => {
      if (!contrasena) {
        if (!esEdicion) {
          ctx.addIssue({ code: "custom", path: ["contrasena"], message: "La contraseña es obligatoria" });
        }
        return;
      }
      if (contrasena.length < 8) {
        ctx.addIssue({ code: "custom", path: ["contrasena"], message: "Debe tener al menos 8 caracteres" });
      }
      if (contrasena !== confirmarContrasena) {
        ctx.addIssue({ code: "custom", path: ["confirmarContrasena"], message: "Las contraseñas no coinciden" });
      }
    });

export type UsuarioFormData = z.infer<ReturnType<typeof crearUsuarioSchema>>;
