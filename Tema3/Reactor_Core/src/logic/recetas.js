// Funciones puras: reciben datos y devuelven datos nuevos.
// Ni React, ni DOM, ni red: se pueden probar en la consola sin montar nada.
import { SUSTITUTOS } from "./sustitutos.js";

export const MAX_INGREDIENTES = 5; // cada ingrediente es una petición a la API
const CAMPOS_INGREDIENTE = 20; // TheMealDB trae strIngredient1…strIngredient20

// "  Chicken_Breast " y "chicken breast" cuentan como el mismo ingrediente
export const normalizar = (texto) => texto.trim().toLowerCase().replace(/[_\s]+/g, " ");

export const normalizarLista = (crudas) =>
  crudas
    .filter(({ idMeal }) => idMeal)
    .map(({ idMeal, strMeal, strMealThumb }) => ({
      id: idMeal,
      nombre: strMeal?.trim() || "Receta sin nombre",
      imagen: strMealThumb,
    }));

// listas[i] son las recetas que usan ingredientes[i]. Junta todas en una sola lista,
// apunta qué ingredientes de la nevera usa cada receta y pone primero las que usan más.
export function combinarResultados(listas, ingredientes) {
  const porId = listas
    .flatMap((lista, i) => lista.map((receta) => ({ receta, ingrediente: ingredientes[i] })))
    .reduce((mapa, { receta, ingrediente }) => {
      const previas = mapa.get(receta.id)?.coincidencias ?? [];
      return mapa.set(receta.id, { ...receta, coincidencias: [...previas, ingrediente] });
    }, new Map());

  return [...porId.values()].toSorted(
    (a, b) => b.coincidencias.length - a.coincidencias.length || a.nombre.localeCompare(b.nombre),
  );
}

// { 3: [...], 1: [...] } → [{ cantidad: 3, recetas }, { cantidad: 1, recetas }]
export const agruparPorCoincidencias = (recetas) =>
  Object.entries(Object.groupBy(recetas, (receta) => receta.coincidencias.length))
    .map(([cantidad, grupo]) => ({ cantidad: Number(cantidad), recetas: grupo }))
    .toSorted((a, b) => b.cantidad - a.cantidad);

// Añade a un ingrediente si lo tienes, si tienes algo que lo sustituye
// (`sustituto`, de tu nevera) y, si no, qué podrías usar en su lugar (`alternativa`)
export function marcarIngrediente(ingrediente, enNevera) {
  const clave = normalizar(ingrediente.nombre);
  const opciones = SUSTITUTOS[clave] ?? [];
  const tienes = enNevera.has(clave);
  return {
    ...ingrediente,
    enNevera: tienes,
    sustituto: tienes ? null : (opciones.find((opcion) => enNevera.has(normalizar(opcion))) ?? null),
    alternativa: opciones[0] ?? null,
  };
}

// Porcentaje de la receta que puedes hacer con lo que tienes (ingredientes o sustitutos)
export const porcentajeCubierto = (ingredientes) =>
  ingredientes.length === 0
    ? 0
    : Math.round(
        (ingredientes.filter(({ enNevera, sustituto }) => enNevera || sustituto).length * 100) /
          ingredientes.length,
      );

// Recorre los campos por su número (1, 2, 3…) para no depender del orden de las claves
export function normalizarReceta(cruda, nevera = []) {
  const enNevera = new Set(nevera.map(normalizar));

  const ingredientes = Array.from({ length: CAMPOS_INGREDIENTE }, (_, i) => i + 1)
    .map((numero) => ({
      posicion: numero,
      nombre: cruda[`strIngredient${numero}`]?.trim() ?? "",
      medida: cruda[`strMeasure${numero}`]?.trim() ?? "",
    }))
    .filter(({ nombre }) => nombre)
    .map((ingrediente) => marcarIngrediente(ingrediente, enNevera));

  const pasos = (cruda.strInstructions ?? "")
    .split(/\r?\n/)
    .map((paso) => paso.trim())
    .filter((paso) => paso && !/^step\s*\d+$/i.test(paso))
    .map((texto, i) => ({ numero: i + 1, texto })); // el número de paso sirve de key

  return {
    id: cruda.idMeal,
    nombre: cruda.strMeal?.trim() || "Receta sin nombre",
    imagen: cruda.strMealThumb,
    categoria: cruda.strCategory,
    area: cruda.strArea,
    // solo enlaces https: nunca se pinta un href que venga raro de la API
    video: cruda.strYoutube?.startsWith("https://") ? cruda.strYoutube : null,
    ingredientes,
    pasos,
  };
}

export const normalizarIngredientes = (crudos) => [
  ...new Set(crudos.map(({ strIngredient }) => strIngredient?.trim()).filter(Boolean)),
].toSorted((a, b) => a.localeCompare(b));

// Devuelve el motivo por el que no se puede añadir, o null si todo está bien
export function validarIngrediente(texto, nevera) {
  if (!texto.trim()) return "Escribe un ingrediente.";
  if (nevera.some((guardado) => normalizar(guardado) === normalizar(texto))) {
    return `«${texto.trim()}» ya está en tu nevera.`;
  }
  if (nevera.length >= MAX_INGREDIENTES) {
    return `Caben como mucho ${MAX_INGREDIENTES} ingredientes. Quita alguno antes.`;
  }
  return null;
}
