// Única fuente de verdad de la validación: el formulario (zodResolver), la vista previa
// y la respuesta del API (safeParse) salen de este fichero. El HTML no valida nada (noValidate).
import { z } from "zod";
import { normalizar } from "../logic/texto.js";
import { palabraAnimal } from "../logic/vegano.js";

export const CATEGORIAS = ["Desayuno", "Principal", "Guarnición", "Postre", "Merienda"];
export const DIFICULTADES = ["fácil", "media", "difícil"];
export const MIN_INGREDIENTES = 2;
export const MAX_INGREDIENTES = 12;
export const MAX_RACIONES = 12;
export const MAX_MINUTOS = 480;
export const MAX_MINUTOS_FACIL = 45;
export const MIN_PASOS = 30;

// Texto obligatorio con mensajes propios. trim() va antes: «   » cuenta como vacío.
// min(1) va primero para que un campo vacío diga «Escribe…» y uno corto diga cuánto falta.
const texto = (campo, min, max) =>
  z
    .string({ error: `Escribe ${campo}` })
    .trim()
    .min(1, `Escribe ${campo}`)
    .min(min, `${capitalizar(campo)}: al menos ${min} caracteres`)
    .max(max, `${capitalizar(campo)}: como mucho ${max} caracteres`);

// Los inputs numéricos se registran con valueAsNumber: vacío llega como NaN y Zod lo rechaza con este mensaje.
const entero = (campo, min, max) =>
  z
    .number({ error: `Escribe ${campo} con números` })
    .int(`${capitalizar(campo)}: sin decimales`)
    .min(min, `${capitalizar(campo)}: mínimo ${min}`)
    .max(max, `${capitalizar(campo)}: máximo ${max}`);

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const esquemaIngrediente = z.object({
  nombre: texto("el ingrediente", 2, 40),
  cantidad: texto("la cantidad", 1, 30),
});

// Refinamiento de la lista: ningún ingrediente repetido (sin contar mayúsculas ni tildes).
// El error se pone en el campo repetido, no en la lista, para que se vea al lado del input.
const esquemaIngredientes = z
  .array(esquemaIngrediente, { error: "Faltan los ingredientes" })
  .min(MIN_INGREDIENTES, `Una receta necesita al menos ${MIN_INGREDIENTES} ingredientes`)
  .max(MAX_INGREDIENTES, `Como mucho ${MAX_INGREDIENTES} ingredientes`)
  .superRefine((ingredientes, contexto) => {
    const vistos = new Set();
    ingredientes.forEach((ingrediente, indice) => {
      const clave = normalizar(ingrediente.nombre);
      if (vistos.has(clave)) {
        contexto.addIssue({ code: "custom", path: [indice, "nombre"], message: `«${ingrediente.nombre}» ya está en la lista` });
      }
      vistos.add(clave);
    });
  });

// Los campos sin refinamientos entre campos: se reutilizan para el esquema del API (extend).
export const camposReceta = z.object({
  nombre: texto("el nombre de la receta", 3, 60),
  autor: texto("tu nombre o alias", 2, 30),
  categoria: z.enum(CATEGORIAS, { error: "Elige una categoría" }),
  dificultad: z.enum(DIFICULTADES, { error: "Elige la dificultad" }),
  raciones: entero("las raciones", 1, MAX_RACIONES),
  minutos: entero("los minutos", 5, MAX_MINUTOS),
  vegana: z.boolean(),
  ingredientes: esquemaIngredientes,
  pasos: texto("los pasos", MIN_PASOS, 2000),
});

// Comprueba si un grupo de campos ya es válido. Sirve para que un refinamiento entre campos
// salte en cuanto esos campos están bien, sin esperar a que el resto del formulario lo esté.
const sonValidos = (campos) => (payload) =>
  camposReceta.pick(campos).safeParse(payload.value).success;

// Esquema del formulario: los campos + dos reglas que cruzan campos.
export const esquemaReceta = camposReceta
  .refine((receta) => receta.dificultad !== "fácil" || receta.minutos <= MAX_MINUTOS_FACIL, {
    path: ["minutos"],
    message: `Una receta fácil no debería pasar de ${MAX_MINUTOS_FACIL} minutos: márcala como media`,
    when: sonValidos({ dificultad: true, minutos: true }),
  })
  .superRefine((receta, contexto) => {
    if (!receta.vegana) return;
    receta.ingredientes.forEach((ingrediente, indice) => {
      const animal = palabraAnimal(ingrediente.nombre);
      if (animal) {
        contexto.addIssue({
          code: "custom",
          path: ["ingredientes", indice, "nombre"],
          message: `Lleva ${animal}: no es vegano. Cámbialo o desmarca «Receta vegana»`,
        });
      }
    });
  }, { when: sonValidos({ vegana: true, ingredientes: true }) });

// Lo que devuelve el API: lo mismo que se publica + id y fecha de creación.
export const esquemaRecetaApi = camposReceta.extend({
  id: z.union([z.string(), z.number()]).transform(String),
  creada: z.iso.datetime({ error: "La fecha de creación no es una fecha ISO" }),
});

// Valores con los que arranca (y vuelve tras publicar) el formulario.
export const RECETA_VACIA = {
  nombre: "",
  autor: "",
  categoria: "",
  dificultad: "",
  raciones: 2,
  minutos: 30,
  vegana: false,
  ingredientes: [
    { nombre: "", cantidad: "" },
    { nombre: "", cantidad: "" },
  ],
  pasos: "",
};
