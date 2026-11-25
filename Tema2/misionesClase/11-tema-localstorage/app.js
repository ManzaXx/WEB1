// Ejercicio 11 · Tema claro/oscuro guardado en localStorage

const CLAVE = "tema";
const boton = document.querySelector("#cambiar-tema");
const valorGuardado = document.querySelector("#valor-guardado");

function aplicarTema(tema) {
  const oscuro = tema === "oscuro";
  // toggle con segundo argumento: añade la clase si es true y la quita si es false
  document.body.classList.toggle("oscuro", oscuro);
  boton.setAttribute("aria-pressed", String(oscuro));
  boton.textContent = oscuro ? "Activar tema claro" : "Activar tema oscuro";
  valorGuardado.textContent = localStorage.getItem(CLAVE) ?? "(ninguno)";
}

// Al cargar: lo que haya guardado o, si no hay nada, "claro"
aplicarTema(localStorage.getItem(CLAVE) ?? "claro");

boton.addEventListener("click", () => {
  const nuevo = document.body.classList.contains("oscuro") ? "claro" : "oscuro";
  // localStorage solo guarda strings; aquí ya es un string, no hace falta JSON.stringify
  localStorage.setItem(CLAVE, nuevo);
  aplicarTema(nuevo);
});
