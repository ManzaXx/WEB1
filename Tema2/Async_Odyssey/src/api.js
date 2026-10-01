const BASE = "https://www.themealdb.com/api/json/v1/1";

const PREFIJO = "nevera:";

function leerCache(url) {
  try {
    const guardado = localStorage.getItem(PREFIJO + url);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

function guardarCache(url, datos) {
  try {
    localStorage.setItem(PREFIJO + url, JSON.stringify(datos));
  } catch {
    // sin espacio o localStorage bloqueado: la app sigue funcionando sin caché
  }
}

async function pedir(url) {
  const enCache = leerCache(url);
  if (enCache) return enCache;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  guardarCache(url, datos);
  return datos;
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

export async function listarIngredientes() {
  const datos = await pedir(`${BASE}/list.php?i=list`);
  return datos.meals ?? [];
}
