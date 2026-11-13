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

// 75 → «1 h 15 min»; 40 → «40 min»
export function formatearMinutos(minutos) {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

// Ingredientes que ya ha usado la comunidad, sin repetir y en orden alfabético.
// Alimenta las sugerencias (datalist) del formulario.
export function ingredientesUsados(recetas) {
  const porClave = new Map(
    recetas.flatMap((receta) => receta.ingredientes).map((ingrediente) => [normalizar(ingrediente.nombre), ingrediente.nombre]),
  );
  return [...porClave.values()].toSorted((a, b) => a.localeCompare(b, "es"));
}
