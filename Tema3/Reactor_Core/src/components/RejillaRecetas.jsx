import TarjetaReceta from "./TarjetaReceta.jsx";

// Rejilla de tarjetas. La usan los resultados de la búsqueda y la vista de favoritos.
export default function RejillaRecetas({ recetas, idsFavoritos, onAbrir, onAlternarFavorito }) {
  return (
    <ul className="rejilla">
      {recetas.map((receta) => (
        // key = id de TheMealDB: estable aunque la lista se reordene o se filtre
        <li key={receta.id}>
          <TarjetaReceta
            receta={receta}
            esFavorita={idsFavoritos.has(receta.id)}
            onAbrir={onAbrir}
            onAlternarFavorito={onAlternarFavorito}
          />
        </li>
      ))}
    </ul>
  );
}
