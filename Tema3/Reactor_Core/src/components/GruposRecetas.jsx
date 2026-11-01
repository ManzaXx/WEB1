import { agruparPorCoincidencias } from "../logic/recetas.js";
import RejillaRecetas from "./RejillaRecetas.jsx";

function tituloGrupo(cantidad, total) {
  if (total === 1) return "Recetas con tu ingrediente";
  if (cantidad === total) return `Usan todo lo que tienes (${total} de ${total})`;
  return `Usan ${cantidad} de tus ${total} ingredientes`;
}

// Pinta las recetas ya combinadas en secciones según cuántos ingredientes
// de la nevera usan. Solo presenta: no pide nada ni guarda estado.
export default function GruposRecetas({ recetas, totalIngredientes, idsFavoritos, onAbrir, onAlternarFavorito }) {
  return (
    <>
      <p className="resumen" role="status">
        {recetas.length} {recetas.length === 1 ? "receta" : "recetas"} con lo que tienes
      </p>
      {agruparPorCoincidencias(recetas).map(({ cantidad, recetas: grupo }) => (
        <section key={cantidad} className="grupo" aria-labelledby={`grupo-${cantidad}`}>
          <h2 id={`grupo-${cantidad}`}>{tituloGrupo(cantidad, totalIngredientes)}</h2>
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
