// Ejercicio 08 · Predecir el orden del event loop

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

// MI PREDICCIÓN (antes de ejecutarlo): 1, 4, 3, 2
//
// Por qué:
// 1. El código síncrono va entero primero, en orden: salen "1" y "4".
// 2. Al vaciarse la pila de llamadas, el event loop atiende ANTES la cola de microtareas
//    (donde van los .then de las promesas): sale "3".
// 3. Solo después pasa a la cola de tareas (macrotareas), donde espera el callback del
//    setTimeout. Aunque el retardo sea 0, el callback no puede adelantar a las microtareas: sale "2".

mostrar("Predicción: 1, 4, 3, 2");
mostrar("Resultado real:");

mostrar("1 · síncrono");

setTimeout(() => {
  mostrar("2 · setTimeout(…, 0) → cola de tareas");
}, 0);

Promise.resolve().then(() => {
  mostrar("3 · Promise.then → cola de microtareas");
});

mostrar("4 · síncrono");
