// Ejercicio 03 · Par o impar con operador ternario

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

// El número está fijado en una variable (el enunciado lo permite); probamos también con varios más
const numero = 7;
const parOImpar = numero % 2 === 0 ? "par" : "impar";
mostrar(`${numero} es ${parOImpar}`);

// Mismo ternario aplicado a otros valores, incluidos el 0 y un negativo
for (const n of [0, 12, -3, 25]) {
  mostrar(`${n} es ${n % 2 === 0 ? "par" : "impar"}`);
}
