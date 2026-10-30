import { MAX_INGREDIENTES, normalizar } from "../logic/recetas.js";

const EJEMPLOS = ["Chicken", "Eggs", "Rice", "Tomatoes"];

// Muestra lo que hay en la nevera como etiquetas que se pueden quitar.
// No guarda estado: todo llega por props desde App.
export default function Nevera({ ingredientes, onQuitar, onAnadir, onVaciar }) {
  if (ingredientes.length === 0) {
    return (
      <section className="nevera nevera--vacia" aria-label="Tu nevera">
        <p>Tu nevera está vacía. Añade algo o prueba con:</p>
        <ul className="nevera__ejemplos">
          {EJEMPLOS.map((ejemplo) => (
            <li key={ejemplo}>
              <button type="button" onClick={() => onAnadir(ejemplo)}>
                {ejemplo}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="nevera" aria-label="Tu nevera">
      <p className="nevera__cuenta">
        En tu nevera ({ingredientes.length}/{MAX_INGREDIENTES}):
      </p>
      <ul className="nevera__lista">
        {ingredientes.map((ingrediente) => (
          <li key={normalizar(ingrediente)} className="etiqueta">
            <span>{ingrediente}</span>
            <button
              type="button"
              onClick={() => onQuitar(ingrediente)}
              aria-label={`Quitar ${ingrediente} de la nevera`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {ingredientes.length > 1 && (
        <button type="button" className="nevera__vaciar" onClick={onVaciar}>
          Vaciar nevera
        </button>
      )}
    </section>
  );
}
