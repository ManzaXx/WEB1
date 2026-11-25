// Ejercicio 01 · Hola consola
// El script se enlaza con defer en index.html, así que cuando se ejecuta el DOM ya existe.

const nombre = "Pablo";
const edad = 21; // cámbiala por tu edad real

// Template literal: comillas invertidas y ${} para meter variables dentro del texto
const mensaje = `Hola, me llamo ${nombre} y tengo ${edad} años.`;

console.log(mensaje);
document.querySelector("#salida").textContent = mensaje;
