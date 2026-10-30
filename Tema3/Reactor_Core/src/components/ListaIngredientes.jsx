import { useState } from "react";

const MENSAJES_COPIA = {
  ok: "Lista copiada. Pégala en tus notas o en un mensaje.",
  error: "Tu navegador no deja copiar al portapapeles.",
};

// Ingredientes de la receta marcando los que ya tienes en la nevera.
// Con lo que falta se monta una lista de la compra que se puede copiar.
export default function ListaIngredientes({ ingredientes, nombreReceta }) {
  const [copia, setCopia] = useState(null); // null, "ok" o "error"

  // Derivados de la prop: no se guardan en estado
  const faltan = ingredientes.filter((ingrediente) => !ingrediente.enNevera);
  const tienes = ingredientes.length - faltan.length;

  async function copiarListaCompra() {
    const lineas = faltan.map(({ nombre, medida }) => `- ${nombre}${medida ? ` (${medida})` : ""}`);
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
      <p className="ingredientes__resumen">
        Tienes {tienes} de {ingredientes.length}.{" "}
        {faltan.length === 0 ? "¡No te falta nada!" : `Te faltan ${faltan.length}.`}
      </p>
      <ul className="ingredientes__lista">
        {ingredientes.map(({ posicion, nombre, medida, enNevera }) => (
          <li key={posicion} className={enNevera ? "ingrediente ingrediente--tienes" : "ingrediente"}>
            <span className="ingrediente__nombre">{nombre}</span>
            {medida && <span className="ingrediente__medida">{medida}</span>}
            {enNevera && <span className="ingrediente__marca">en tu nevera</span>}
          </li>
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
