import { useFetch } from "../hooks/useFetch.js";
import { urlPorIngrediente, mensajeDeError } from "../api/mealdb.js";
import { normalizarLista, combinarResultados } from "../logic/recetas.js";
import Estado from "./Estado.jsx";
import GruposRecetas from "./GruposRecetas.jsx";

// Pide las recetas de cada ingrediente de la nevera (una petición por ingrediente,
// en paralelo) y decide qué estado enseñar. Pintar los grupos es cosa de GruposRecetas.
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

  // Se deriva en cada render a partir de `datos` y `nevera`: no es estado
  const recetas = combinarResultados((datos ?? []).map(normalizarLista), nevera);

  if (recetas.length === 0) {
    return (
      <Estado>
        Ninguna receta usa {nevera.join(", ")}. TheMealDB solo entiende nombres exactos en
        inglés: elige una de las sugerencias del buscador.
      </Estado>
    );
  }

  return (
    <GruposRecetas
      recetas={recetas}
      totalIngredientes={nevera.length}
      idsFavoritos={idsFavoritos}
      onAbrir={onAbrir}
      onAlternarFavorito={onAlternarFavorito}
    />
  );
}
