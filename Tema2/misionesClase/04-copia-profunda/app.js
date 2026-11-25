// Ejercicio 04 · Copia superficial (spread) frente a copia profunda (structuredClone)

const salida = document.querySelector("#salida");

function mostrar(etiqueta, valor) {
  console.log(etiqueta, valor);
  salida.textContent += `${etiqueta} ${JSON.stringify(valor)}\n`;
}

const config = {
  idioma: "es",
  pantalla: { tema: "claro", tamanoLetra: 16 }, // objeto anidado
};

const copiaSpread = { ...config };
const copiaProfunda = structuredClone(config);

// Cambiamos el objeto anidado en cada copia
copiaSpread.pantalla.tema = "oscuro";
copiaProfunda.pantalla.tamanoLetra = 20;

mostrar("config:", config);
mostrar("copiaSpread:", copiaSpread);
mostrar("copiaProfunda:", copiaProfunda);

// Por qué difieren:
// - El spread copia solo el primer nivel. La propiedad pantalla se copia como referencia:
//   config.pantalla y copiaSpread.pantalla son EL MISMO objeto, así que cambiar el tema en la
//   copia también cambia el original.
// - structuredClone copia todos los niveles: copiaProfunda.pantalla es un objeto nuevo, y
//   cambiar su tamaño de letra no afecta a config.
mostrar("mismo objeto anidado con spread:", config.pantalla === copiaSpread.pantalla); // true
mostrar("mismo objeto anidado con structuredClone:", config.pantalla === copiaProfunda.pantalla); // false
