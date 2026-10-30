const VISTAS = [
  { id: "recetas", texto: "Recetas" },
  { id: "favoritos", texto: "Favoritos" },
];

// Selector de vista. La vista activa la guarda App; aquí solo se pinta y se avisa.
export default function Pestanas({ vista, totalFavoritos, onCambiar }) {
  return (
    <nav className="pestanas" aria-label="Vistas">
      {VISTAS.map(({ id, texto }) => (
        <button
          key={id}
          type="button"
          className="pestanas__boton"
          aria-pressed={vista === id}
          onClick={() => onCambiar(id)}
        >
          {texto}
          {id === "favoritos" && <span className="pestanas__contador">{totalFavoritos}</span>}
        </button>
      ))}
    </nav>
  );
}
