// Ejercicio 03 · Contador con función actualizadora
import { useState } from "react";

export default function Ej03ContadorMas3() {
  const [cuenta, setCuenta] = useState(0);

  function sumarTresMal() {
    // Por qué NO funciona: cuenta es una "foto" del estado en este render. Si vale 0,
    // las tres líneas equivalen a setCuenta(0 + 1): React recibe tres veces "pon un 1"
    // y el resultado es 1, no 3. El estado no cambia hasta el siguiente render.
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
  }

  function sumarTres() {
    // Con la función actualizadora, React encola las tres funciones y le pasa a cada una
    // el valor que dejó la anterior: 0 → 1 → 2 → 3
    setCuenta((c) => c + 1);
    setCuenta((c) => c + 1);
    setCuenta((c) => c + 1);
  }

  return (
    <div className="ejercicio">
      <p className="numero-grande" aria-live="polite">{cuenta}</p>
      <div className="fila">
        <button type="button" onClick={sumarTres}>+3</button>
        <button type="button" className="secundario" onClick={sumarTresMal}>
          +3 mal (con cuenta + 1)
        </button>
        <button type="button" className="secundario" onClick={() => setCuenta(0)}>
          Reiniciar
        </button>
      </div>
      <p className="nota">El botón «+3 mal» solo suma 1: las tres llamadas leen el mismo valor de <code>cuenta</code>.</p>
    </div>
  );
}
