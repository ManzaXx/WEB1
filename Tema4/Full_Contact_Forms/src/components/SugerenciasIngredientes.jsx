import { ingredientesUsados } from "../logic/texto.js";
import { useRecetas } from "../queries/recetas.js";
import { TODAS } from "../services/recetas.js";

export const ID_SUGERENCIAS = "ingredientes-de-la-comunidad";

// Sugiere los ingredientes que ya usa la comunidad. Usa la misma query que el listado
// sin filtro (misma clave), así TanStack Query no hace una petición más: comparte la caché.
export default function SugerenciasIngredientes() {
  const { data } = useRecetas(TODAS);
  const sugerencias = data ? ingredientesUsados(data.recetas) : [];

  return (
    <datalist id={ID_SUGERENCIAS}>
      {sugerencias.map((nombre) => (
        <option key={nombre} value={nombre} />
      ))}
    </datalist>
  );
}
