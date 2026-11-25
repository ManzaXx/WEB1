// Ejercicio 04 · Lista de tareas sin mutar el estado y con key estable
import { useState } from "react";
import { TAREAS_INICIALES, anadirTarea, alternarTarea, borrarTarea } from "./tareas.js";

export default function Ej04ListaTareas() {
  const [tareas, setTareas] = useState(TAREAS_INICIALES);
  const [texto, setTexto] = useState("");

  function enviar(evento) {
    evento.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    setTareas(anadirTarea(tareas, limpio)); // spread: array nuevo con la tarea al final
    setTexto("");
  }

  return (
    <div className="ejercicio">
      <form className="fila" onSubmit={enviar}>
        <label htmlFor="nueva-tarea" className="visualmente-oculto">Nueva tarea</label>
        <input
          id="nueva-tarea"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una tarea…"
          autoComplete="off"
        />
        <button type="submit">Añadir</button>
      </form>

      <ListaTareas
        tareas={tareas}
        onAlternar={(id) => setTareas(alternarTarea(tareas, id))}
        onBorrar={(id) => setTareas(borrarTarea(tareas, id))}
      />
    </div>
  );
}

// Componente de presentación: se reutiliza en el ejercicio 05
export function ListaTareas({ tareas, onAlternar, onBorrar }) {
  if (tareas.length === 0) {
    return <p className="vacio">No hay tareas.</p>;
  }

  return (
    <ul className="tareas">
      {tareas.map((t) => (
        // key estable: el id de la tarea, no su posición
        <li key={t.id} className={t.hecha ? "tarea tarea--hecha" : "tarea"}>
          <span className="tarea__texto">{t.texto}</span>
          <button type="button" className="secundario" onClick={() => onAlternar(t.id)}>
            {t.hecha ? "Desmarcar" : "Hecha"}
          </button>
          <button type="button" className="peligro" onClick={() => onBorrar(t.id)} aria-label={`Borrar «${t.texto}»`}>
            Borrar
          </button>
        </li>
      ))}
    </ul>
  );
}
