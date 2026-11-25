// Ejercicio 11 (reto) · Validación simple de un email con el evento input

const campo = document.querySelector("#email");
const estado = document.querySelector("#estado");

// "input" salta con cada cambio del valor (teclear, pegar, borrar), no solo al salir del campo
campo.addEventListener("input", () => {
  const texto = campo.value.trim();

  // Quitamos las dos clases y ponemos la que toque
  estado.classList.remove("valido", "invalido");

  if (texto === "") {
    estado.textContent = "Escribe tu email";
    return;
  }

  // La comprobación que pide el enunciado: que haya una @ y un punto
  const pareceEmail = texto.includes("@") && texto.includes(".");

  if (pareceEmail) {
    estado.textContent = "✓ Parece un email válido";
    estado.classList.add("valido");
  } else {
    estado.textContent = "✗ Falta la @ o el punto";
    estado.classList.add("invalido");
  }
});
