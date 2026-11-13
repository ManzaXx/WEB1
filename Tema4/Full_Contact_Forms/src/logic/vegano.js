import { normalizar } from "./texto.js";

// Palabras que delatan un ingrediente de origen animal (ya normalizadas: sin tildes y en minúsculas).
const ANIMALES = [
  "pollo", "ternera", "cerdo", "cordero", "jamon", "bacon", "chorizo", "atun", "salmon", "merluza",
  "gamba", "huevo", "leche", "nata", "queso", "mantequilla", "yogur", "miel", "anchoa", "gelatina",
];

// Si el nombre lleva una de estas palabras es la versión vegetal: «leche de avena», «queso vegano»…
const VEGETALES = ["vegan", "vegetal", "avena", "soja", "almendra", "coco", "cacahuete", "arroz"];

// Devuelve la palabra animal que encuentra («leche») o null si el ingrediente parece vegano.
export function palabraAnimal(nombre) {
  const palabras = normalizar(nombre).split(" ");
  const esVegetal = VEGETALES.some((vegetal) => palabras.some((palabra) => palabra.startsWith(vegetal)));
  if (esVegetal) return null;
  // «huevos» o «muslos de pollo» también cuentan: se mira si la palabra empieza por la raíz animal
  return ANIMALES.find((animal) => palabras.some((palabra) => palabra.startsWith(animal))) ?? null;
}
