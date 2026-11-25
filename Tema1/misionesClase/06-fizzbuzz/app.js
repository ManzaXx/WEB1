// Ejercicio 06 · FizzBuzz del 1 al 30

const salida = document.querySelector("#salida");
const lineas = [];

for (let i = 1; i <= 30; i++) {
  let resultado;
  // Primero el caso de ambos múltiplos: si fuera al final, nunca se llegaría a él
  if (i % 3 === 0 && i % 5 === 0) {
    resultado = "FizzBuzz";
  } else if (i % 3 === 0) {
    resultado = "Fizz";
  } else if (i % 5 === 0) {
    resultado = "Buzz";
  } else {
    resultado = i;
  }
  console.log(resultado);
  lineas.push(resultado);
}

salida.textContent = lineas.join("\n");
