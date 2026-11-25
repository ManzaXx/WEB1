// Esquema del formulario de registro de la unidad, con el campo edad del ejercicio 03.
// Lo comparten los ejercicios 03 y 06 (el 06 es el mismo formulario, auditado).
import { z } from "zod";

export const esquemaRegistro = z
  .object({
    nombre: z.string().trim().min(2, "El nombre es demasiado corto"),
    email: z.email("Email no válido"),
    // Los inputs siempre dan strings: coerce lo convierte a número antes de validar
    edad: z.coerce
      .number({ error: "Escribe tu edad en números" })
      .int("La edad tiene que ser un número entero")
      .min(18, "Debes ser mayor de edad")
      .max(120, "Revisa la edad"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    repetir: z.string(),
    aceptaTerminos: z.literal(true, { error: "Debes aceptar los términos" }),
  })
  // Validación cruzada: compara dos campos, por eso va sobre el objeto entero
  .refine((d) => d.password === d.repetir, {
    error: "Las contraseñas no coinciden",
    path: ["repetir"], // el error se asigna al campo repetir
  });

export const VALORES_INICIALES_REGISTRO = {
  nombre: "",
  email: "",
  edad: "",
  password: "",
  repetir: "",
  aceptaTerminos: false,
};
