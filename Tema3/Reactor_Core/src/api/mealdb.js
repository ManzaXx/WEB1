// Solo red: construye las URLs de TheMealDB y hace las peticiones.
// No sabe nada de React ni del DOM.
import { leerCache, guardarCache } from "./cache.js";

const BASE = "https://www.themealdb.com/api/json/v1/1";

// Errores con nombre propio para poder dar un mensaje distinto a cada caso
export class ErrorHttp extends Error {
  constructor(status) {
    super(`La API respondió con el código ${status}`);
    this.name = "ErrorHttp";
    this.status = status;
  }
}

export class ErrorDatos extends Error {
  constructor() {
    super("La API devolvió datos con un formato inesperado");
    this.name = "ErrorDatos";
  }
}

// La API solo acepta el nombre exacto, con guiones bajos en lugar de espacios
const aClave = (texto) => encodeURIComponent(texto.trim().replace(/\s+/g, "_"));

export const urlPorIngrediente = (ingrediente) => `${BASE}/filter.php?i=${aClave(ingrediente)}`;
export const urlReceta = (id) => `${BASE}/lookup.php?i=${encodeURIComponent(id)}`;
export const URL_INGREDIENTES = `${BASE}/list.php?i=list`;

// Pide una URL y devuelve el array `meals` (o [] si la API dice null).
// La señal permite cancelar la petición si el componente ya no la necesita.
export async function pedirComidas(url, signal) {
  const enCache = leerCache(url);
  if (enCache) return enCache;

  const respuesta = await fetch(url, { signal });
  if (!respuesta.ok) throw new ErrorHttp(respuesta.status);

  const datos = await respuesta.json();
  // TheMealDB responde { meals: [...] } o { meals: null }; cualquier otra forma es un error
  if (!datos || !("meals" in datos)) throw new ErrorDatos();

  const comidas = datos.meals ?? [];
  guardarCache(url, comidas);
  return comidas;
}

// Traduce cualquier error a un texto para la persona usuaria
export function mensajeDeError(error) {
  if (error instanceof ErrorHttp) {
    return `El servidor de recetas falló (código ${error.status}). Prueba en un rato.`;
  }
  if (error instanceof ErrorDatos) {
    return "La API de recetas devolvió algo raro. Prueba con otro ingrediente.";
  }
  // fetch lanza TypeError cuando no hay red o el servidor no responde
  return "No hay conexión con el servidor de recetas. Revisa tu internet.";
}
