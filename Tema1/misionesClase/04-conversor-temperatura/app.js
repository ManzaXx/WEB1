// Ejercicio 04 · Conversor de Celsius a Fahrenheit

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

function celsiusAFahrenheit(c) {
  return c * 9 / 5 + 32;
}

// Valores de prueba: congelación y ebullición del agua, temperatura corporal y el punto
// donde las dos escalas coinciden (-40)
const pruebas = [0, 100, 36.5, -40, 21];

for (const c of pruebas) {
  mostrar(`${c} °C = ${celsiusAFahrenheit(c)} °F`);
}
