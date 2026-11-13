// Servicio de recetas: lo único que sabe de URLs y del API. Los componentes nunca llaman a fetch.
// Todo lo que entra del servidor pasa por Zod (safeParse) antes de llegar a React.
import { z } from "zod";
import { esquemaRecetaApi } from "../schemas/receta.js";
import { ErrorConfiguracion, ErrorDatos, pedirJson } from "./http.js";

export const TODAS = "todas";

function urlRecetas(ruta = "") {
  const base = import.meta.env.VITE_API_URL;
  if (!base) throw new ErrorConfiguracion("Falta VITE_API_URL: copia .env.example como .env y reinicia Vite.");
  return `${base}/recetas${ruta}`;
}

// Separa las recetas válidas de las corruptas. Una receta mala no tumba la lista entera:
// se descarta y se cuenta, y la UI avisa de cuántas y por qué.
export function validarLista(datos) {
  const lista = z.array(z.unknown()).safeParse(datos);
  if (!lista.success) throw new ErrorDatos("El servidor no ha devuelto una lista de recetas.");

  const resultados = lista.data.map((dato) => ({ dato, resultado: esquemaRecetaApi.safeParse(dato) }));
  const recetas = resultados
    .filter(({ resultado }) => resultado.success)
    .map(({ resultado }) => resultado.data)
    .toSorted((a, b) => b.creada.localeCompare(a.creada));
  const descartadas = resultados
    .filter(({ resultado }) => !resultado.success)
    .map(({ dato, resultado }) => ({ id: String(dato?.id ?? "sin id"), problemas: describirProblemas(resultado.error) }));

  return { recetas, descartadas };
}

// «raciones: Escribe las raciones con números». Solo el primer problema de cada campo,
// igual que en el formulario (un texto vacío también es «demasiado corto»: no se repite).
function describirProblemas(error) {
  const porCampo = new Map();
  for (const problema of error.issues) {
    const campo = problema.path.join(".") || "receta";
    if (!porCampo.has(campo)) porCampo.set(campo, `${campo}: ${problema.message}`);
  }
  return [...porCampo.values()];
}

export async function listarRecetas({ categoria = TODAS, signal } = {}) {
  const filtro = categoria === TODAS ? "" : `?${new URLSearchParams({ categoria })}`;
  return validarLista(await pedirJson(urlRecetas(filtro), { signal }));
}

export async function crearReceta(receta) {
  const creada = await pedirJson(urlRecetas(), {
    metodo: "POST",
    cuerpo: { ...receta, creada: new Date().toISOString() },
  });
  const resultado = esquemaRecetaApi.safeParse(creada);
  if (!resultado.success) throw new ErrorDatos("La receta se envió, pero el servidor devolvió datos raros.");
  return resultado.data;
}

export async function borrarReceta(id) {
  await pedirJson(urlRecetas(`/${encodeURIComponent(id)}`), { metodo: "DELETE" });
  return id;
}
