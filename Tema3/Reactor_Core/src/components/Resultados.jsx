import { useFetch } from "../hooks/useFetch.js";
import { urlPorIngrediente, mensajeDeError } from "../api/mealdb.js";
import { normalizarLista, combinarResultados, agruparPorCoincidencias } from "../logic/recetas.js";
import Estado from "./Estado.jsx";
import RejillaRecetas from "./RejillaRecetas.jsx";

function tituloGrupo(cantidad, total) {
  if (total === 1) return "Recetas con tu ingrediente";
  if (cantidad === total) return `Usan todo lo que tienes (${total} de ${total})`;
  return `Usan ${cantidad} de tus ${total} ingredientes`;
}

// Pide las recetas de cada ingrediente de la nevera (una petición por ingrediente,
// en paralelo) y las enseña agrupadas: primero las que aprovechan más cosas.
export default function Resultados({ nevera, idsFavoritos, onAbrir, onAlternarFavorito }) {
  const { datos, error, cargando, reintentar } = useFetch(nevera.map(urlPorIngrediente));

  if (nevera.length === 0) return null; // la propia Nevera ya explica qué hacer

  if (cargando) {
    return <Estado tipo="cargando">Buscando recetas con {nevera.join(", ")}…</Estado>;
  }

  if (error) {
    return (
      <Estado
        tipo="error"
        accion={
          <button type="button" onClick={reintentar}>
            Reintentar
          </button>
        }
      >
        {mensajeDeError(error)}
      </Estado>
    );
  }

  // Todo lo que sigue se calcula en cada render a partir de `datos` y `nevera`:
  // no se guarda en estado porque se puede derivar
  const recetas = combinarResultados((datos ?? []).map(normalizarLista), nevera);

  if (recetas.length === 0) {
    return (
      <Estado>
        Ninguna receta usa {nevera.join(", ")}. TheMealDB solo entiende nombres exactos en
        inglés: elige uno de las sugerencias del buscador.
      </Estado>
    );
  }

  return (
    <>
      <p className="resumen" role="status">
        {recetas.length} {recetas.length === 1 ? "receta" : "recetas"} con lo que tienes
      </p>
      {agruparPorCoincidencias(recetas).map(({ cantidad, recetas: grupo }) => (
        <section key={cantidad} className="grupo" aria-labelledby={`grupo-${cantidad}`}>
          <h2 id={`grupo-${cantidad}`}>{tituloGrupo(cantidad, nevera.length)}</h2>
          <RejillaRecetas
            recetas={grupo}
            idsFavoritos={idsFavoritos}
            onAbrir={onAbrir}
            onAlternarFavorito={onAlternarFavorito}
          />
        </section>
      ))}
    </>
  );
}
