import BotonFavorito from "./BotonFavorito.jsx";

// Una receta en la rejilla: foto, nombre, qué ingredientes de tu nevera usa
// y el botón de favoritos. La tarjeta no decide nada: avisa al padre con callbacks.
export default function TarjetaReceta({ receta, esFavorita, onAbrir, onAlternarFavorito }) {
  const { nombre, imagen, coincidencias = [] } = receta;

  return (
    <article className="tarjeta">
      <button type="button" className="tarjeta__abrir" onClick={() => onAbrir(receta.id)}>
        <img src={imagen ? `${imagen}/small` : undefined} alt="" loading="lazy" width="250" height="250" />
        <span className="tarjeta__nombre">{nombre}</span>
      </button>
      {coincidencias.length > 0 && (
        <p className="tarjeta__usa">Usa: {coincidencias.join(", ")}</p>
      )}
      <BotonFavorito nombre={nombre} esFavorita={esFavorita} onAlternar={() => onAlternarFavorito(receta)} />
    </article>
  );
}
