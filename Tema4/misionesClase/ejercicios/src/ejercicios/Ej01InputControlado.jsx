// Ejercicio 01 · Input controlado básico (repaso)
import { useState } from "react";

export default function Ej01InputControlado() {
  // Controlado: el valor vive en el estado de React y el input solo lo muestra
  const [texto, setTexto] = useState("");

  return (
    <div className="ejercicio">
      <div>
        <label htmlFor="texto-01">Escribe algo</label>
        <input id="texto-01" value={texto} onChange={(e) => setTexto(e.target.value)} autoComplete="off" />
      </div>
      {/* Como cada tecla actualiza el estado, todo lo derivado se recalcula al momento */}
      <p>
        Caracteres: <strong className="numero">{texto.length}</strong>
      </p>
      <p className="resultado" aria-live="polite">
        {texto ? texto.toUpperCase() : <span className="vacio">(aquí sale en mayúsculas)</span>}
      </p>
    </div>
  );
}
