import { useState } from "react";
import { porcentajeCubierto } from "../logic/recetas.js";
import Ingrediente from "./Ingrediente.jsx";

const MENSAJES_COPIA = {
  ok: "Lista copiada. Pégala en tus notas o en un mensaje.",
  error: "Tu navegador no deja copiar al portapapeles.",
};

// Ingredientes de la receta, cuánto de ella puedes hacer ya (contando sustitutos)
// y una lista de la compra con lo que falta que se puede copiar.
export default function ListaIngredientes({ ingredientes, nombreReceta }) {
  const [copia, setCopia] = useState(null); // null, "ok" o "error"

  // Derivados de la prop: no se guardan en estado
  const faltan = ingredientes.filter(({ enNevera, sustituto }) => !enNevera && !sustituto);
  const tienes = ingredientes.length - faltan.length;
  const porcentaje = porcentajeCubierto(ingredientes);

  async function copiarListaCompra() {
    const lineas = faltan.map(
      ({ nombre, medida, alternativa }) =>
        `- ${nombre}${medida ? ` (${medida})` : ""}${alternativa ? ` · o ${alternativa}` : ""}`,
    );
    try {
      await navigator.clipboard.writeText([`Comprar para ${nombreReceta}:`, ...lineas].join("\n"));
      setCopia("ok");
    } catch {
      setCopia("error");
    }
  }

  if (ingredientes.length === 0) {
    return <p>Esta receta no trae la lista de ingredientes.</p>;
  }

  return (
    <section className="ingredientes" aria-labelledby="titulo-ingredientes">
      <h3 id="titulo-ingredientes">Ingredientes</h3>
      <div className="cobertura">
        <p className="cobertura__texto">
          <strong>{porcentaje}&nbsp;%</strong> de la receta con lo que tienes ({tienes} de{" "}
          {ingredientes.length}). {faltan.length === 0 ? "¡No te falta nada!" : `Te faltan ${faltan.length}.`}
        </p>
        <meter
          className="cobertura__barra"
          min="0"
          max={ingredientes.length}
          value={tienes}
          aria-label="Ingredientes que ya tienes"
        />
      </div>
      <ul className="ingredientes__lista">
        {ingredientes.map((ingrediente) => (
          <Ingrediente key={ingrediente.posicion} {...ingrediente} />
        ))}
      </ul>
      {faltan.length > 0 && (
        <button type="button" className="boton-secundario" onClick={copiarListaCompra}>
          Copiar lista de la compra ({faltan.length})
        </button>
      )}
      <p className="ingredientes__copia" role="status">
        {MENSAJES_COPIA[copia] ?? ""}
      </p>
    </section>
  );
}
