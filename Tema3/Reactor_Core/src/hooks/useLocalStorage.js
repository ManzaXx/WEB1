import { useEffect, useRef, useState } from "react";

// Mismo tipo de dato (array con array, objeto con objeto…): protege de valores raros
const mismoTipo = (a, b) => typeof a === typeof b && Array.isArray(a) === Array.isArray(b);

function leer(clave, inicial) {
  try {
    const texto = localStorage.getItem(clave);
    if (texto === null) return inicial;
    const valor = JSON.parse(texto);
    return mismoTipo(valor, inicial) ? valor : inicial;
  } catch {
    // JSON corrupto o localStorage bloqueado (modo privado): se empieza de cero
    return inicial;
  }
}

// Como useState, pero el valor sobrevive a recargas y se sincroniza entre pestañas
export function useLocalStorage(clave, inicial) {
  // Función inicializadora: localStorage solo se lee en el primer render
  const [valor, setValor] = useState(() => leer(clave, inicial));

  // Texto del último valor que ya está reflejado en localStorage (o el valor por defecto).
  // Es una ref y no estado porque cambiarlo no debe provocar ningún render
  const ultimoTexto = useRef(null);
  ultimoTexto.current ??= JSON.stringify(valor);

  // Sincronizar con un sistema externo (localStorage) es justo el trabajo de un efecto.
  // Solo escribe si el valor cambió: en el primer montaje no hay nada nuevo que guardar
  useEffect(() => {
    const texto = JSON.stringify(valor);
    if (texto === ultimoTexto.current) return;
    ultimoTexto.current = texto;
    try {
      localStorage.setItem(clave, texto);
    } catch {
      // sin espacio o bloqueado: la app sigue funcionando, solo que sin guardar
    }
  }, [clave, valor]);

  // Si otra pestaña cambia la misma clave, el evento "storage" avisa a esta
  useEffect(() => {
    function alCambiarEnOtraPestana(evento) {
      if (evento.key !== clave || evento.newValue === null) return;
      try {
        const nuevo = JSON.parse(evento.newValue);
        setValor((actual) => (mismoTipo(nuevo, actual) ? nuevo : actual));
      } catch {
        // valor corrupto: se ignora
      }
    }
    window.addEventListener("storage", alCambiarEnOtraPestana);
    return () => window.removeEventListener("storage", alCambiarEnOtraPestana);
  }, [clave]);

  return [valor, setValor];
}
