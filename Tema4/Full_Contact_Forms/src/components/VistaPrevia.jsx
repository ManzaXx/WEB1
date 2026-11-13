import { useWatch } from "react-hook-form";
import { formatearMinutos } from "../logic/texto.js";
import { camposReceta, esquemaReceta } from "../schemas/receta.js";

const CAMPOS = Object.keys(camposReceta.shape);

// Vista previa en vivo: cómo quedará la tarjeta y cuántos campos están ya listos.
// «Listo» lo decide el mismo esquema de Zod que valida el envío (una sola fuente de verdad).
export default function VistaPrevia({ control }) {
  const receta = useWatch({ control });
  const listos = CAMPOS.filter((campo) => camposReceta.shape[campo].safeParse(receta[campo]).success).length;
  const preparada = esquemaReceta.safeParse(receta).success;
  // Todos los campos valen por separado, pero falla una regla entre campos (vegana o fácil)
  const progreso = preparada
    ? "Lista para publicar"
    : listos === CAMPOS.length
      ? "Falta cumplir una regla: mira los avisos"
      : `${listos} de ${CAMPOS.length} campos listos`;
  const ingredientes = receta.ingredientes.filter((ingrediente) => ingrediente.nombre.trim() !== "");

  return (
    <aside className="previa" aria-labelledby="titulo-previa">
      <div className="previa__cabecera">
        <h3 id="titulo-previa">Así se verá</h3>
        <span className="previa__progreso">{progreso}</span>
      </div>
      <meter className="previa__barra" min={0} max={CAMPOS.length} value={listos} aria-label="Campos listos" />

      <p className="previa__nombre">{receta.nombre.trim() || "Tu receta"}</p>
      <p className="previa__meta">
        {[
          receta.categoria,
          receta.dificultad,
          Number.isFinite(receta.minutos) ? formatearMinutos(receta.minutos) : null,
          Number.isFinite(receta.raciones) ? `${receta.raciones} raciones` : null,
          receta.vegana ? "vegana" : null,
        ]
          .filter(Boolean)
          .join(" · ") || "Rellena el formulario y aparecerá aquí"}
      </p>
      {ingredientes.length > 0 && (
        <p className="previa__ingredientes">{ingredientes.map((ingrediente) => ingrediente.nombre.trim()).join(", ")}</p>
      )}
    </aside>
  );
}
