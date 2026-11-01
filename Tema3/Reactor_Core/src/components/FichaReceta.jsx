import BotonFavorito from "./BotonFavorito.jsx";
import ListaIngredientes from "./ListaIngredientes.jsx";

// Contenido de una receta ya cargada y normalizada. Solo pinta: no pide ni guarda nada.
export default function FichaReceta({ receta, esFavorita, onAlternarFavorito }) {
  const { id, nombre, imagen, categoria, area, video, ingredientes, pasos } = receta;
  const meta = [categoria, area].filter(Boolean).join(" · ");

  return (
    <article className="ficha">
      {imagen && (
        <img className="ficha__foto" src={`${imagen}/medium`} alt={nombre} width="500" height="500" />
      )}
      <div className="ficha__texto">
        <h2 id="titulo-receta">{nombre}</h2>
        {meta && <p className="ficha__meta">{meta}</p>}
        <BotonFavorito
          nombre={nombre}
          esFavorita={esFavorita}
          onAlternar={() => onAlternarFavorito({ id, nombre, imagen })}
          conTexto
        />

        <ListaIngredientes ingredientes={ingredientes} nombreReceta={nombre} />

        <h3>Preparación</h3>
        {pasos.length > 0 ? (
          <ol className="pasos">
            {pasos.map(({ numero, texto }) => (
              <li key={numero}>{texto}</li>
            ))}
          </ol>
        ) : (
          <p>Esta receta no trae instrucciones.</p>
        )}

        {video && (
          <a className="ficha__video" href={video} target="_blank" rel="noopener noreferrer">
            Ver el vídeo de la receta (YouTube)
          </a>
        )}
      </div>
    </article>
  );
}
