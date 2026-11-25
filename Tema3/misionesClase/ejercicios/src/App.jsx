import { useState } from "react";
import Ej01Saludo from "./ejercicios/Ej01Saludo.jsx";
import Ej02Tarjeta from "./ejercicios/Ej02Tarjeta.jsx";
import Ej03ContadorMas3 from "./ejercicios/Ej03ContadorMas3.jsx";
import Ej04ListaTareas from "./ejercicios/Ej04ListaTareas.jsx";
import Ej05FiltroDerivado from "./ejercicios/Ej05FiltroDerivado.jsx";
import Ej06Reloj from "./ejercicios/Ej06Reloj.jsx";
import Ej07LevantarEstado from "./ejercicios/Ej07LevantarEstado.jsx";
import Ej08TemaContext from "./ejercicios/Ej08TemaContext.jsx";
import Ej09Carrito from "./ejercicios/Ej09Carrito.jsx";
import Ej10AntiEfecto from "./ejercicios/Ej10AntiEfecto.jsx";

// Lista de ejercicios: el menú y el contenido salen de aquí
const EJERCICIOS = [
  { id: "01", titulo: "Hola componente", Componente: Ej01Saludo },
  { id: "02", titulo: "Tarjeta de perfil", Componente: Ej02Tarjeta },
  { id: "03", titulo: "Contador +3", Componente: Ej03ContadorMas3 },
  { id: "04", titulo: "Lista de tareas", Componente: Ej04ListaTareas },
  { id: "05", titulo: "Filtro derivado", Componente: Ej05FiltroDerivado },
  { id: "06", titulo: "Reloj con useEffect", Componente: Ej06Reloj },
  { id: "07", titulo: "Levantar el estado", Componente: Ej07LevantarEstado },
  { id: "08", titulo: "Tema con useContext", Componente: Ej08TemaContext },
  { id: "09", titulo: "Carrito con useReducer", Componente: Ej09Carrito },
  { id: "10", titulo: "Refactor anti-efecto", Componente: Ej10AntiEfecto },
];

// El ejercicio abierto se guarda en el hash de la URL (#06) para poder enlazarlo o recargar sin perderlo
function idInicial() {
  const id = window.location.hash.slice(1);
  return EJERCICIOS.some((e) => e.id === id) ? id : "01";
}

export default function App() {
  const [actual, setActual] = useState(idInicial);
  const ejercicio = EJERCICIOS.find((e) => e.id === actual);
  const { Componente } = ejercicio;

  function abrir(id) {
    setActual(id);
    window.location.hash = id; // se cambia en el manejador del clic, no hace falta un efecto
  }

  return (
    <div className="app">
      <header className="cabecera">
        <p className="cabecera__tema">Tema 3 · React Core</p>
        <h1>Ejercicios de clase</h1>
      </header>

      <nav aria-label="Ejercicios" className="menu">
        <ul>
          {EJERCICIOS.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onClick={() => abrir(e.id)}
                aria-current={e.id === actual ? "page" : undefined}
              >
                <span className="menu__num">{e.id}</span> {e.titulo}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="contenido">
        <h2>
          Ejercicio {ejercicio.id} · {ejercicio.titulo}
        </h2>
        {/* key: al cambiar de ejercicio se monta de cero, sin arrastrar estado del anterior */}
        <Componente key={ejercicio.id} />
      </main>
    </div>
  );
}
