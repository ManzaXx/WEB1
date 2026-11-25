// Ejercicio 02 · Tipos primitivos y typeof

const salida = document.querySelector("#salida");

// Escribe en la consola y en el <pre> de la página
function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

// Una variable de cada tipo primitivo de JavaScript
const texto = "hola";
const numero = 42;
const grande = 9007199254740993n; // BigInt: enteros más grandes que Number.MAX_SAFE_INTEGER
const booleano = true;
let sinDefinir; // declarada pero sin valor → undefined
const nulo = null;
const simbolo = Symbol("id");

const primitivos = [texto, numero, grande, booleano, sinDefinir, nulo, simbolo];

for (const valor of primitivos) {
  // String() convierte cualquier valor (también Symbol y BigInt) a texto para poder pintarlo
  mostrar(`${String(valor).padEnd(18)} → typeof "${typeof valor}"`);
}

// ¿Por qué typeof null es "object"?
// Es un error histórico de la primera versión de JavaScript (1995): los valores se guardaban
// con una etiqueta de tipo y la de los objetos era 0; null se representaba como el puntero
// nulo (todo ceros), así que typeof lo leía como objeto. Corregirlo rompería webs antiguas,
// por eso se mantiene. Para comprobar si algo es null hay que usar valor === null.
mostrar("");
mostrar(`typeof null === "object" → ${typeof null === "object"} (error histórico de JS)`);
mostrar(`nulo === null → ${nulo === null} (la forma correcta de comprobarlo)`);
