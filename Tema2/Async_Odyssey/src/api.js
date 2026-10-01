const BASE = "https://www.themealdb.com/api/json/v1/1";

async function pedir(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }
  return respuesta.json();
}

export async function buscarPorIngrediente(ingrediente) {
  const clave = encodeURIComponent(ingrediente.trim().replace(/\s+/g, "_"));
  const datos = await pedir(`${BASE}/filter.php?i=${clave}`);
  return datos.meals ?? [];
}

export async function obtenerReceta(id) {
  const datos = await pedir(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  return datos.meals?.[0] ?? null;
}
