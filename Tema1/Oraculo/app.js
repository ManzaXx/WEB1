// --- Estado del juego ---
const secreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;

// --- Referencias al DOM ---
const entrada  = document.querySelector("#entrada");
const boton    = document.querySelector("#boton");
const mensaje  = document.querySelector("#mensaje");
const marcador = document.querySelector("#marcador");

// --- Función auxiliar: refrescar el contador en pantalla ---
function actualizarMarcador() {
  marcador.textContent = `Intentos: ${intentos}`;
}

// --- Lógica principal ---
boton.addEventListener("click", () => {
  const valor = Number(entrada.value);

  // Validación: vacío, no numérico o fuera de 1–100
  if (entrada.value === "" || Number.isNaN(valor) || valor < 1 || valor > 100) {
    mensaje.textContent = "Introduce un número válido entre 1 y 100.";
    return;
  }

  // Consulta válida -> incrementa intentos
  intentos++;

  // Compara y decide el mensaje
  if (valor > secreto) {
    mensaje.textContent = "El número secreto es menor.";
  } else if (valor < secreto) {
    mensaje.textContent = "El número secreto es mayor.";
  } else {
    mensaje.textContent = `¡Acertaste! Lo lograste en ${intentos} intentos.`;
    boton.disabled = true;
  }

  // Actualiza el marcador
  actualizarMarcador();
});