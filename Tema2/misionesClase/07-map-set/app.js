// Ejercicio 07 · Map para contar palabras y Set para las únicas

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

const palabras = ["sol", "mar", "sol", "luna", "mar", "sol", "estrella"];

// Map: clave = palabra, valor = cuántas veces sale
const conteo = new Map();
for (const palabra of palabras) {
  // get devuelve undefined la primera vez, por eso el ?? 0
  conteo.set(palabra, (conteo.get(palabra) ?? 0) + 1);
}

mostrar("Veces que aparece cada palabra:");
for (const [palabra, veces] of conteo) {
  mostrar(`  ${palabra}: ${veces}`);
}

// Set: guarda cada valor una sola vez, así que elimina los repetidos
const unicas = new Set(palabras);
mostrar(`Palabras únicas (${unicas.size}): ${[...unicas].join(", ")}`);
