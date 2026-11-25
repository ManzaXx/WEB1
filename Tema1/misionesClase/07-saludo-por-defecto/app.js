// Ejercicio 07 · Saludo configurable con parámetro por defecto

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

// Si no se pasa nombre (o se pasa undefined), toma el valor "invitado"
const saludar = (nombre = "invitado") => `Hola, ${nombre}`;

mostrar(saludar("Pablo"));      // con argumento
mostrar(saludar());             // sin argumento → valor por defecto
mostrar(saludar(undefined));    // undefined también activa el valor por defecto
mostrar(saludar(null));         // null NO lo activa: es un valor que sí se ha pasado
