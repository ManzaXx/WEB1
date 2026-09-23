// Constantes de iconos para parejas
const ICONOS = ['⚡', '💾', '⚙️', '📡', '🔒', '🔑', '🚀', '👾'];

// Estado de la aplicación
let estado = {
  cartas: [],
  cartasSeleccionadas: [],
  parejasResueltas: 0,
  intentos: 0,
  segundos: 0,
  bloqueado: false,
  timerRef: null
};

// Referencias a elementos del DOM
const boardElement = document.querySelector('#board');
const movesElement = document.querySelector('#moves-count');
const timerElement = document.querySelector('#timer');
const btnRestart = document.querySelector('#btn-restart');
const winBanner = document.querySelector('#win-message');
const winSummary = document.querySelector('#win-summary');

// Iniciar reloj
function iniciarTemporizador() {
  detenerTemporizador();
  estado.segundos = 0;
  actualizarReloj();
  estado.timerRef = setInterval(() => {
    estado.segundos += 1;
    actualizarReloj();
  }, 1000);
}

function detenerTemporizador() {
  if (estado.timerRef) {
    clearInterval(estado.timerRef);
    estado.timerRef = null;
  }
}

function actualizarReloj() {
  const min = String(Math.floor(estado.segundos / 60)).padStart(2, '0');
  const sec = String(estado.segundos % 60).padStart(2, '0');
  timerElement.textContent = `${min}:${sec}`;
}

// Barajar array (Fisher-Yates)
function barajar(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}