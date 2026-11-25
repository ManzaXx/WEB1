// Ejercicio 09 · fetch con respuesta.ok y manejo de errores

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

async function obtenerNombresUsuarios(url = "https://jsonplaceholder.typicode.com/users") {
  try {
    const respuesta = await fetch(url);
    // fetch solo rechaza si no hay red; un 404 o un 500 llegan como respuesta "normal",
    // así que hay que comprobar ok (status 200-299) a mano
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }
    const usuarios = await respuesta.json();
    return usuarios.map((u) => u.name);
  } catch (error) {
    console.error("No se pudieron obtener los usuarios:", error.message);
    return []; // el que llama siempre recibe un array, aunque falle
  }
}

async function iniciar() {
  mostrar("Cargando usuarios…");
  const nombres = await obtenerNombresUsuarios();
  mostrar(`Recibidos ${nombres.length} nombres:`);
  nombres.forEach((n) => mostrar(`  · ${n}`));

  // Prueba del caso de error: esta ruta no existe y la API responde 404
  const conError = await obtenerNombresUsuarios("https://jsonplaceholder.typicode.com/no-existe");
  mostrar(`Con una URL que da 404 → ${JSON.stringify(conError)} (el error sale en la consola)`);
}

iniciar();
