// Ejercicio 01 · Inmutabilidad básica

const salida = document.querySelector("#salida");

// Escribe en la consola y en el <pre> de la página (los arrays/objetos, como JSON)
function mostrar(etiqueta, valor) {
  console.log(etiqueta, valor);
  salida.textContent += `${etiqueta} ${JSON.stringify(valor)}\n`;
}

const notas = [7, 4, 9, 2];

// toSorted devuelve un array NUEVO; sort ordenaría el propio array (lo muta)
const ordenadas = notas.toSorted((a, b) => b - a);

mostrar("ordenadas:", ordenadas); // [9, 7, 4, 2]
mostrar("notas (original):", notas); // [7, 4, 9, 2] → intacto
mostrar("¿son el mismo array?", ordenadas === notas); // false
