// Ejercicio 10 · Promise.all, allSettled y race cuando una promesa falla

const salida = document.querySelector("#salida");
const inicio = performance.now();

function mostrar(texto) {
  const ms = Math.round(performance.now() - inicio);
  console.log(`[${ms} ms] ${texto}`);
  salida.textContent += `[${String(ms).padStart(4)} ms] ${texto}\n`;
}

// Tres funciones que devuelven promesas con setTimeout de distinta duración
const rapida = () => new Promise((resolve) => setTimeout(() => resolve("rápida (300 ms)"), 300));
const falla = () => new Promise((_, reject) => setTimeout(() => reject(new Error("falla (600 ms)")), 600));
const lenta = () => new Promise((resolve) => setTimeout(() => resolve("lenta (900 ms)"), 900));

async function iniciar() {
  // Promise.all: espera a todas, pero en cuanto UNA rechaza, rechaza entera con ese error
  try {
    const resultados = await Promise.all([rapida(), falla(), lenta()]);
    mostrar(`all → ${resultados}`);
  } catch (error) {
    mostrar(`all → RECHAZA con "${error.message}" (no llegamos a ver las que sí fueron bien)`);
  }

  // Promise.allSettled: nunca rechaza; espera a todas y dice cómo acabó cada una
  const informe = await Promise.allSettled([rapida(), falla(), lenta()]);
  mostrar("allSettled → espera a las tres:");
  for (const r of informe) {
    mostrar(`    ${r.status}: ${r.status === "fulfilled" ? r.value : r.reason.message}`);
  }

  // Promise.race: se queda con la PRIMERA que termine, vaya bien o mal
  const ganadora = await Promise.race([rapida(), falla(), lenta()]);
  mostrar(`race → "${ganadora}" (la rápida termina antes de que falle la otra)`);

  // race sin la rápida: ahora la primera en terminar es la que falla, y race rechaza
  try {
    await Promise.race([falla(), lenta()]);
  } catch (error) {
    mostrar(`race sin la rápida → RECHAZA con "${error.message}"`);
  }
}

iniciar();
