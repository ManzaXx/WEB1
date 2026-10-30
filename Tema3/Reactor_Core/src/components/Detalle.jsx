import { useEffect, useRef } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { urlReceta, mensajeDeError } from "../api/mealdb.js";
import { normalizarReceta } from "../logic/recetas.js";
import Estado from "./Estado.jsx";
import FichaReceta from "./FichaReceta.jsx";

// Ventana modal con el detalle de una receta. Usa <dialog> nativo:
// Escape para cerrar, foco atrapado dentro y, al cerrar, el foco vuelve a la tarjeta.
export default function Detalle({ id, nevera, esFavorita, onAlternarFavorito, onCerrar }) {
  const dialogo = useRef(null);
  const { datos, error, cargando, reintentar } = useFetch([urlReceta(id)]);

  // showModal() es una API del navegador, así que abrirlo es sincronizar con el DOM.
  // Sin limpieza: al desmontar, React quita el <dialog> y el navegador lo cierra.
  useEffect(() => {
    if (!dialogo.current.open) dialogo.current.showModal();
  }, []);

  // close() dispara el evento "close" del <dialog>, que avisa a App con onCerrar
  const cerrar = () => dialogo.current.close();

  // Un clic en el fondo oscuro (fuera de la caja) también cierra
  function manejarClic(evento) {
    if (evento.target === evento.currentTarget) cerrar();
  }

  const cruda = datos?.[0][0];

  return (
    <dialog
      ref={dialogo}
      className="detalle"
      onClose={onCerrar}
      onClick={manejarClic}
      aria-labelledby={cruda ? "titulo-receta" : undefined}
      aria-label={cruda ? undefined : "Receta"}
    >
      <div className="detalle__caja">
        <button type="button" className="detalle__cerrar" onClick={cerrar} aria-label="Cerrar receta">
          ×
        </button>

        {cargando && <Estado tipo="cargando">Abriendo la receta…</Estado>}
        {error && (
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
        )}
        {datos && !cruda && <Estado>Esta receta ya no existe en TheMealDB.</Estado>}
        {cruda && (
          <FichaReceta
            receta={normalizarReceta(cruda, nevera)}
            esFavorita={esFavorita}
            onAlternarFavorito={onAlternarFavorito}
          />
        )}
      </div>
    </dialog>
  );
}
