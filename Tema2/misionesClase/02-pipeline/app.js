// Ejercicio 02 · Pipeline funcional encadenado

const salida = document.querySelector("#salida");

function mostrar(etiqueta, valor) {
  console.log(etiqueta, valor);
  salida.textContent += `${etiqueta} ${JSON.stringify(valor)}\n`;
}

// El array del apartado de objetos de los apuntes
const productos = [
  { nombre: "Teclado", precio: 25, stock: 0 },
  { nombre: "Ratón", precio: 15, stock: 12 },
  { nombre: "Monitor", precio: 180, stock: 4 },
];

// Una sola expresión: cada paso devuelve un array nuevo y no toca productos
const disponibles = productos
  .filter((p) => p.stock > 0)              // [Ratón, Monitor]
  .map((p) => p.nombre.toUpperCase())      // ["RATÓN", "MONITOR"]
  .toSorted((a, b) => a.localeCompare(b, "es")); // orden alfabético en español

mostrar("disponibles:", disponibles); // ["MONITOR", "RATÓN"]
mostrar("productos sigue igual:", productos);
