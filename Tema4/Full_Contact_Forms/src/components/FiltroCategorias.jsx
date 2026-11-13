import { CATEGORIAS } from "../schemas/receta.js";
import { TODAS } from "../services/recetas.js";

const OPCIONES = [TODAS, ...CATEGORIAS];

// Botones de filtro: las mismas categorías del esquema de Zod, más «todas».
export default function FiltroCategorias({ actual, onCambiar }) {
  return (
    <div className="filtro" role="group" aria-label="Filtrar por categoría">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion}
          type="button"
          className="filtro__opcion"
          aria-pressed={opcion === actual}
          onClick={() => onCambiar(opcion)}
        >
          {opcion === TODAS ? "Todas" : opcion}
        </button>
      ))}
    </div>
  );
}
