// Botón de corazón para guardar o quitar una receta de favoritos.
// Se usa en las tarjetas y en el detalle: por eso es un componente aparte.
export default function BotonFavorito({ nombre, esFavorita, onAlternar, conTexto = false }) {
  const etiqueta = esFavorita ? `Quitar ${nombre} de favoritos` : `Guardar ${nombre} en favoritos`;
  return (
    <button
      type="button"
      className="favorito"
      onClick={onAlternar}
      aria-pressed={esFavorita}
      aria-label={conTexto ? undefined : etiqueta}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" />
      </svg>
      {conTexto && <span>{esFavorita ? "En favoritos" : "Guardar"}</span>}
    </button>
  );
}
