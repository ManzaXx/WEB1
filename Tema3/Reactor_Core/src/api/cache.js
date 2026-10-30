// Caché de respuestas en localStorage con caducidad.
// Cada entrada guarda { guardado, datos } para saber cuándo se pidió.

const PREFIJO = "nevera-react:";
const CADUCIDAD_MS = 24 * 60 * 60 * 1000; // un día: las recetas cambian poco

export function leerCache(clave) {
  try {
    const texto = localStorage.getItem(PREFIJO + clave);
    if (!texto) return null;
    const { guardado, datos } = JSON.parse(texto);
    if (typeof guardado !== "number" || Date.now() - guardado > CADUCIDAD_MS) {
      localStorage.removeItem(PREFIJO + clave);
      return null;
    }
    return datos;
  } catch {
    // JSON corrupto o localStorage bloqueado: se ignora y se pide a la red
    return null;
  }
}

export function guardarCache(clave, datos) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify({ guardado: Date.now(), datos }));
  } catch {
    // sin espacio o localStorage bloqueado: la app sigue funcionando sin caché
  }
}
