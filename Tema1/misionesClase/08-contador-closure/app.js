// Ejercicio 08 · Contador con closure

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

function crearContador() {
  let cuenta = 0; // variable privada: solo la ve la función de dentro
  // La función devuelta "recuerda" su variable cuenta aunque crearContador ya haya terminado
  return () => {
    cuenta++;
    return cuenta;
  };
}

const contadorA = crearContador();
const contadorB = crearContador();

mostrar(`A: ${contadorA()}`); // 1
mostrar(`A: ${contadorA()}`); // 2
mostrar(`A: ${contadorA()}`); // 3
mostrar(`B: ${contadorB()}`); // 1 → B tiene su propia cuenta, no comparte la de A
mostrar(`A: ${contadorA()}`); // 4

// Desde fuera no hay forma de leer ni cambiar cuenta: no existe en este ámbito
mostrar(`typeof cuenta fuera del closure: ${typeof cuenta}`);
