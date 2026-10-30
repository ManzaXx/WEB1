import { useEffect, useState } from "react";
import { pedirComidas } from "../api/mealdb.js";

const SEPARADOR = " "; // las URLs van codificadas, así que nunca llevan espacios

// Pide varias URLs en paralelo y devuelve { datos, error, cargando }.
// datos[i] es la respuesta de urls[i]. Con un array vacío no pide nada.
export function useFetch(urls) {
  // El efecto depende de un texto y no del array: un array nuevo en cada render
  // con las mismas URLs no debe repetir la petición
  const clave = urls.join(SEPARADOR);
  const [resultado, setResultado] = useState({ clave: "", datos: null, error: null });

  useEffect(() => {
    if (!clave) return;
    const controlador = new AbortController();

    Promise.all(clave.split(SEPARADOR).map((url) => pedirComidas(url, controlador.signal)))
      .then((datos) => {
        if (!controlador.signal.aborted) setResultado({ clave, datos, error: null });
      })
      .catch((error) => {
        if (!controlador.signal.aborted) setResultado({ clave, datos: null, error });
      });

    // Limpieza: si cambian las URLs o el componente se desmonta, la petición
    // anterior se cancela y su respuesta ya no puede pisar a la nueva
    return () => controlador.abort();
  }, [clave]);

  // «cargando» no se guarda: se deduce de si el resultado es de las URLs actuales
  const esActual = resultado.clave === clave;
  return {
    datos: esActual ? resultado.datos : null,
    error: esActual ? resultado.error : null,
    cargando: clave !== "" && !esActual,
  };
}
