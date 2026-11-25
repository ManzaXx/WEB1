// Ejercicio 03 · Agrupar aprobados y suspensos con Object.groupBy

const salida = document.querySelector("#salida");

function mostrar(etiqueta, valor) {
  console.log(etiqueta, valor);
  salida.textContent += `${etiqueta} ${JSON.stringify(valor, null, 2)}\n`;
}

const alumnos = [
  { nombre: "Lucía", nota: 8.5 },
  { nombre: "Mario", nota: 4 },
  { nombre: "Aitana", nota: 5 },
  { nombre: "Hugo", nota: 3.2 },
  { nombre: "Nerea", nota: 9.1 },
];

// La función devuelve la clave del grupo en el que cae cada alumno
const grupos = Object.groupBy(alumnos, (a) => (a.nota >= 5 ? "aprobados" : "suspensos"));

mostrar("grupos:", grupos);
// Ojo: si nadie suspende, la clave "suspensos" no existe (no sale un array vacío)
mostrar("nº de aprobados:", grupos.aprobados?.length ?? 0);
