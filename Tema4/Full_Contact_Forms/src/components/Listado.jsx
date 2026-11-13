import { useState } from "react";
import { useRecetas } from "../queries/recetas.js";
import { mensajeDeError } from "../services/http.js";
import { TODAS } from "../services/recetas.js";
import AvisoCorruptas from "./AvisoCorruptas.jsx";
import Estado from "./Estado.jsx";
import FiltroCategorias from "./FiltroCategorias.jsx";
import TarjetaReceta from "./TarjetaReceta.jsx";

// Listado de la comunidad. La categoría es el único estado propio: forma parte de la clave
// de la query, así cada filtro tiene su caché y volver a uno ya visto es instantáneo.
export default function Listado() {
  const [categoria, setCategoria] = useState(TODAS);
  const { data, error, isPending, isError, isFetching, refetch } = useRecetas(categoria);

  return (
    <section className="panel listado" aria-labelledby="titulo-listado" aria-busy={isFetching}>
      <div className="listado__cabecera">
        <h2 id="titulo-listado">Recetas de la comunidad</h2>
        {/* isFetching sin isPending = ya hay datos y se están refrescando por detrás */}
        <span className="listado__refresco" role="status">
          {isFetching && !isPending ? "Actualizando…" : ""}
        </span>
      </div>

      <FiltroCategorias actual={categoria} onCambiar={setCategoria} />
      <ContenidoListado
        data={data}
        error={error}
        isPending={isPending}
        isError={isError}
        categoria={categoria}
        onReintentar={() => refetch()}
      />
    </section>
  );
}

// Elige un solo contenido según el estado de la query, con returns tempranos.
function ContenidoListado({ data, error, isPending, isError, categoria, onReintentar }) {
  if (isPending) return <Estado tipo="cargando">Cargando recetas…</Estado>;
  if (isError) {
    return (
      <Estado tipo="error" onReintentar={onReintentar}>
        {mensajeDeError(error)}
      </Estado>
    );
  }

  const { recetas, descartadas } = data;
  return (
    <>
      <AvisoCorruptas descartadas={descartadas} />
      {recetas.length === 0 ? (
        <Estado tipo="vacio">
          {categoria === TODAS ? "Todavía no hay recetas." : `Todavía no hay recetas de ${categoria}.`} ¡Publica la primera!
        </Estado>
      ) : (
        <ul className="listado__rejilla">
          {recetas.map((receta) => (
            <li key={receta.id}>
              <TarjetaReceta receta={receta} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
