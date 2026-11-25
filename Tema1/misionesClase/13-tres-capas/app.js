// Capa JavaScript: comportamiento. Mejora el formulario que ya funciona sin JS:
// en vez de recargar la página, cambia el estado y el contador al momento.

const formulario = document.querySelector(".me-gusta");
const boton = document.querySelector("#boton-me-gusta");
const contador = document.querySelector("#contador-me-gusta");

formulario.addEventListener("submit", (evento) => {
  // Evitamos el envío normal (no hay servidor en este ejercicio); en una app real
  // aquí iría un fetch("/me-gusta", { method: "POST" }) para guardar el voto
  evento.preventDefault();

  const yaGusta = boton.getAttribute("aria-pressed") === "true";
  const total = Number(contador.textContent);

  boton.setAttribute("aria-pressed", String(!yaGusta));
  contador.textContent = yaGusta ? total - 1 : total + 1;
});
