// Ejercicio 07 · Levantar el estado entre dos componentes hermanos
import { useState } from "react";

// Hermano 1: no tiene estado propio. Recibe el valor y una función para cambiarlo
// (el dato baja por props y el cambio "sube" llamando a onCambio)
function CampoTexto({ valor, onCambio }) {
  return (
    <div>
      <label htmlFor="texto-07">Escribe algo</label>
      <input id="texto-07" value={valor} onChange={(e) => onCambio(e.target.value)} autoComplete="off" />
    </div>
  );
}

// Hermano 2: solo lee el valor
function Mayusculas({ valor }) {
  return (
    <p className="resultado" aria-live="polite">
      {valor ? valor.toUpperCase() : <span className="vacio">(aquí sale en mayúsculas)</span>}
    </p>
  );
}

export default function Ej07LevantarEstado() {
  // El estado vive en el padre común porque lo necesitan los dos hermanos
  const [texto, setTexto] = useState("");

  return (
    <div className="ejercicio">
      <CampoTexto valor={texto} onCambio={setTexto} />
      <Mayusculas valor={texto} />
    </div>
  );
}
