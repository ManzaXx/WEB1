import { formatearMinutos } from "../logic/texto.js";
import { useBorrarReceta } from "../queries/recetas.js";
import { mensajeDeError } from "../services/http.js";

const formatoFecha = new Intl.DateTimeFormat("es", { day: "numeric", month: "short" });

// Cada tarjeta tiene su propia mutación de borrado: su «Borrando…» y su error no afectan
// a las demás, y el listado no tiene que pasarle callbacks (sin prop drilling).
export default function TarjetaReceta({ receta }) {
  const borrar = useBorrarReceta();

  return (
    <article className="tarjeta">
      <header className="tarjeta__cabecera">
        <h3>{receta.nombre}</h3>
        {receta.vegana && <span className="etiqueta etiqueta--vegana">vegana</span>}
      </header>
      <p className="tarjeta__meta">
        {receta.categoria} · {receta.dificultad} · {formatearMinutos(receta.minutos)} · {receta.raciones}&nbsp;raciones
      </p>
      <p className="tarjeta__autor">
        de {receta.autor}, <time dateTime={receta.creada}>{formatoFecha.format(new Date(receta.creada))}</time>
      </p>

      <details className="tarjeta__detalle">
        <summary>Ingredientes y pasos</summary>
        <ul>
          {receta.ingredientes.map((ingrediente) => (
            <li key={ingrediente.nombre}>
              {ingrediente.nombre} <span className="tarjeta__cantidad">{ingrediente.cantidad}</span>
            </li>
          ))}
        </ul>
        <p>{receta.pasos}</p>
      </details>

      <button
        type="button"
        className="boton boton--peligro"
        onClick={() => borrar.mutate(receta.id)}
        disabled={borrar.isPending}
        aria-label={`Borrar ${receta.nombre}`}
      >
        {borrar.isPending ? "Borrando…" : "Borrar"}
      </button>
      {borrar.isError && (
        <p className="aviso aviso--error" role="alert">
          {mensajeDeError(borrar.error)}
        </p>
      )}
    </article>
  );
}
