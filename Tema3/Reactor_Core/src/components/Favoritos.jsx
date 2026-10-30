import RejillaRecetas from "./RejillaRecetas.jsx";
import Estado from "./Estado.jsx";

// Vista de recetas guardadas. No pide nada a la API: usa lo guardado en localStorage.
export default function Favoritos({ favoritos, idsFavoritos, onAbrir, onAlternarFavorito }) {
  if (favoritos.length === 0) {
    return <Estado>Aún no has guardado ninguna receta. Pulsa el corazón de una tarjeta.</Estado>;
  }

  return (
    <section className="grupo" aria-labelledby="titulo-favoritos">
      <h2 id="titulo-favoritos">Tus recetas guardadas</h2>
      <RejillaRecetas
        recetas={favoritos}
        idsFavoritos={idsFavoritos}
        onAbrir={onAbrir}
        onAlternarFavorito={onAlternarFavorito}
      />
    </section>
  );
}
