// Ejercicio 05 · Clasificador de notas (0-10)

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

// Uso if/else porque son rangos; switch encaja mejor con valores exactos
function clasificarNota(nota) {
  if (typeof nota !== "number" || nota < 0 || nota > 10) {
    return "Nota no válida";
  }
  if (nota < 5) {
    return "Suspenso";
  } else if (nota < 7) {
    return "Aprobado";
  } else if (nota < 9) {
    return "Notable";
  } else {
    return "Sobresaliente";
  }
}

// Probamos los límites de cada tramo y dos valores fuera de rango
const pruebas = [0, 4.9, 5, 6.9, 7, 8.9, 9, 10, 11, -1];

for (const nota of pruebas) {
  mostrar(`${String(nota).padStart(4)} → ${clasificarNota(nota)}`);
}
