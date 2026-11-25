// Ejercicio 10 · DOM: contador con botones + y −

const valor = document.querySelector("#valor");
const botonMas = document.querySelector("#mas");
const botonMenos = document.querySelector("#menos");

// El estado vive en una variable; el DOM solo lo refleja
let cuenta = 0;

function pintar() {
  valor.textContent = cuenta;
}

botonMas.addEventListener("click", () => {
  cuenta++;
  pintar();
});

botonMenos.addEventListener("click", () => {
  cuenta--;
  pintar();
});
