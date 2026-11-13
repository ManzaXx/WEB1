// Funciones puras sobre texto, sin React ni red.

// «  Pimentón DULCE » → «pimenton dulce»: para comparar sin mayúsculas, tildes ni espacios de más.
export function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// Ingredientes que ya ha usado la comunidad, sin repetir y en orden alfabético.
// Alimenta las sugerencias (datalist) del formulario.
export function ingredientesUsados(recetas) {
  const porClave = new Map(
    recetas.flatMap((receta) => receta.ingredientes).map((ingrediente) => [normalizar(ingrediente.nombre), ingrediente.nombre]),
  );
  return [...porClave.values()].toSorted((a, b) => a.localeCompare(b, "es"));
}
