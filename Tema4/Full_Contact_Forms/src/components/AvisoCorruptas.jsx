// Bonus visible: si Zod descartó recetas del servidor, se avisa y se enseña por qué.
export default function AvisoCorruptas({ descartadas }) {
  if (descartadas.length === 0) return null;

  const resumen =
    descartadas.length === 1
      ? "1 receta del servidor llegó corrupta: Zod la ha descartado"
      : `${descartadas.length} recetas del servidor llegaron corruptas: Zod las ha descartado`;

  return (
    <details className="corruptas">
      <summary>{resumen}</summary>
      <ul>
        {descartadas.map((receta) => (
          <li key={receta.id}>
            <strong>Receta con id {receta.id}</strong>
            <ul>
              {receta.problemas.map((problema) => (
                <li key={problema}>{problema}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </details>
  );
}
