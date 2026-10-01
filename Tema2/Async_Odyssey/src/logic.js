export const normalizarLista = (crudas) =>
  crudas.map(({ idMeal, strMeal, strMealThumb }) => ({
    id: idMeal,
    nombre: strMeal,
    imagen: strMealThumb,
  }));

export const agruparPorLetra = (recetas) =>
  recetas.reduce((grupos, receta) => {
    const letra = (receta.nombre?.trim()[0] ?? "#").toUpperCase();
    (grupos[letra] ??= []).push(receta);
    return grupos;
  }, {});

export const normalizarReceta = (cruda) => {
  const ingredientes = Object.keys(cruda)
    .filter((clave) => clave.startsWith("strIngredient") && cruda[clave]?.trim())
    .map((clave) => ({
      ingrediente: cruda[clave].trim(),
      medida: (cruda[clave.replace("Ingredient", "Measure")] ?? "").trim(),
    }));

  const pasos = (cruda.strInstructions ?? "")
    .split(/\r?\n/)
    .map((paso) => paso.trim())
    .filter(Boolean);

  return {
    id: cruda.idMeal,
    nombre: cruda.strMeal,
    imagen: cruda.strMealThumb,
    categoria: cruda.strCategory,
    area: cruda.strArea,
    ingredientes,
    pasos,
  };
};
