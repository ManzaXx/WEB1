// Ejercicio 09 · DOM: cambiar el texto y la clase de un título

const titulo = document.querySelector("#titulo");
const boton = document.querySelector("#boton");

boton.addEventListener("click", () => {
  // textContent en vez de innerHTML: solo cambia texto, nunca interpreta HTML
  titulo.textContent = "¡Título cambiado desde JavaScript!";
  titulo.classList.add("destacado");
});
