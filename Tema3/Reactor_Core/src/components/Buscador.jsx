import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { URL_INGREDIENTES } from "../api/mealdb.js";
import { normalizarIngredientes, validarIngrediente } from "../logic/recetas.js";

const ID_SUGERENCIAS = "sugerencias-ingredientes";
const URLS_SUGERENCIAS = [URL_INGREDIENTES]; // fuera del componente: siempre la misma

// Formulario para meter un ingrediente en la nevera.
// El input es controlado: su valor vive en el estado `texto`.
export default function Buscador({ nevera, onAnadir }) {
  const [texto, setTexto] = useState("");
  const [aviso, setAviso] = useState("");

  // Si la lista de ingredientes falla, el buscador sigue funcionando sin sugerencias
  const { datos } = useFetch(URLS_SUGERENCIAS);
  const sugerencias = datos ? normalizarIngredientes(datos[0]) : [];

  function manejarEnvio(evento) {
    evento.preventDefault();
    const motivo = validarIngrediente(texto, nevera);
    if (motivo) {
      setAviso(motivo);
      return;
    }
    onAnadir(texto.trim());
    setTexto("");
    setAviso("");
  }

  function manejarCambio(evento) {
    setTexto(evento.target.value);
    setAviso("");
  }

  return (
    <form className="buscador" onSubmit={manejarEnvio} noValidate>
      <label htmlFor="ingrediente">¿Qué tienes en la nevera? (en inglés)</label>
      <div className="buscador__fila">
        <input
          id="ingrediente"
          type="text"
          value={texto}
          onChange={manejarCambio}
          placeholder="chicken, egg, rice…"
          autoComplete="off"
          list={ID_SUGERENCIAS}
          aria-describedby="aviso-ingrediente"
          aria-invalid={aviso !== ""}
        />
        <button type="submit">Añadir</button>
      </div>
      <datalist id={ID_SUGERENCIAS}>
        {sugerencias.map((nombre) => (
          <option key={nombre} value={nombre} />
        ))}
      </datalist>
      <p id="aviso-ingrediente" className="buscador__aviso" role="status">
        {aviso}
      </p>
    </form>
  );
}
