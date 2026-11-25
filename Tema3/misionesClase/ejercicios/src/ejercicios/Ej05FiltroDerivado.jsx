// Ejercicio 05 · Filtro derivado: la lista filtrada se calcula en el render, no es estado
import { useState } from "react";
import { TAREAS_INICIALES, anadirTarea, alternarTarea, borrarTarea } from "./tareas.js";
import { ListaTareas } from "./Ej04ListaTareas.jsx";

export default function Ej05FiltroDerivado() {
  // Estado mínimo: solo lo que no se puede calcular a partir de otra cosa
  const [tareas, setTareas] = useState(TAREAS_INICIALES);
  const [texto, setTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // DERIVADO: se recalcula en cada render a partir de tareas y busqueda.
  // Si fuera otro useState habría que acordarse de actualizarlo al añadir, borrar,
  // marcar o buscar; tarde o temprano se desincronizaría.
  const termino = busqueda.trim().toLowerCase();
  const filtradas = tareas.filter((t) => t.texto.toLowerCase().includes(termino));

  function enviar(evento) {
    evento.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;
    setTareas(anadirTarea(tareas, limpio));
    setTexto("");
  }

  return (
    <div className="ejercicio">
      <form className="fila" onSubmit={enviar}>
        <label htmlFor="nueva-tarea-05" className="visualmente-oculto">Nueva tarea</label>
        <input
          id="nueva-tarea-05"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe una tarea…"
          autoComplete="off"
        />
        <button type="submit">Añadir</button>
      </form>

      <label htmlFor="buscar-tarea">Buscar</label>
      <input
        id="buscar-tarea"
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Filtra por texto…"
        autoComplete="off"
      />
      <p className="nota" aria-live="polite">
        Mostrando {filtradas.length} de {tareas.length} tareas
      </p>

      <ListaTareas
        tareas={filtradas}
        onAlternar={(id) => setTareas(alternarTarea(tareas, id))}
        onBorrar={(id) => setTareas(borrarTarea(tareas, id))}
      />
    </div>
  );
}
