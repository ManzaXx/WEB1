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

// Renderizado inicial del tablero mediante DOM API
function inicializarJuego() {
  detenerTemporizador();
  estado.parejasResueltas = 0;
  estado.intentos = 0;
  estado.cartasSeleccionadas = [];
  estado.bloqueado = false;
  
  movesElement.textContent = '0';
  winBanner.classList.add('hidden');
  
  // Duplicar y barajar
  const mazo = barajar([...ICONOS, ...ICONOS]);
  estado.cartas = mazo;

  // Limpiar tablero anterior
  boardElement.replaceChildren();

  // Creación dinámica de nodos en el DOM
  mazo.forEach((icono, index) => {
    const cardNode = document.createElement('button');
    cardNode.classList.add('card');
    cardNode.dataset.index = String(index);
    cardNode.dataset.valor = icono;
    cardNode.setAttribute('aria-label', 'Carta oculta');
    boardElement.appendChild(cardNode);
  });

  iniciarTemporizador();
}

// Delegación de eventos en el tablero
boardElement.addEventListener('click', (evento) => {
  const cardNode = evento.target.closest('.card');

  // Validaciones tempranas
  if (!cardNode || estado.bloqueado) return;
  if (cardNode.classList.contains('revealed') || cardNode.classList.contains('matched')) return;

  voltearCarta(cardNode);
});

function voltearCarta(cardNode) {
  // Mostrar icono de forma segura
  cardNode.textContent = cardNode.dataset.valor;
  cardNode.classList.add('revealed');
  estado.cartasSeleccionadas.push(cardNode);

  if (estado.cartasSeleccionadas.length === 2) {
    evaluarJugada();
  }
}

function evaluarJugada() {
  estado.intentos += 1;
  movesElement.textContent = String(estado.intentos);

  const [carta1, carta2] = estado.cartasSeleccionadas;
  const esCoincidencia = carta1.dataset.valor === carta2.dataset.valor;

  if (esCoincidencia) {
    carta1.classList.add('matched');
    carta2.classList.add('matched');
    estado.parejasResueltas += 1;
    estado.cartasSeleccionadas = [];

    if (estado.parejasResueltas === ICONOS.length) {
      finalizarPartida();
    }
  } else {
    estado.bloqueado = true;
    setTimeout(() => {
      carta1.textContent = '';
      carta2.textContent = '';
      carta1.classList.remove('revealed');
      carta2.classList.remove('revealed');
      estado.cartasSeleccionadas = [];
      estado.bloqueado = false;
    }, 850);
  }
}

function finalizarPartida() {
  detenerTemporizador();
  const min = Math.floor(estado.segundos / 60);
  const sec = estado.segundos % 60;
  
  winSummary.textContent = `Completado en ${estado.intentos} intentos y ${min}m ${sec}s.`;
  winBanner.classList.remove('hidden');
}

// Botón de reinicio
btnRestart.addEventListener('click', inicializarJuego);

// Bonus: tecla secreta (M o m) para modo oscuro
document.addEventListener('keydown', (evento) => {
  if (evento.key.toLowerCase() === 'm') {
    document.body.classList.toggle('dark-mode');
  }
});

// Arrancar al cargar
inicializarJuego();