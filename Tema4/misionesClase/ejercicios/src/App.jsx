import { useState } from "react";
import Ej01InputControlado from "./ejercicios/Ej01InputControlado.jsx";
import Ej02LoginRHF from "./ejercicios/Ej02LoginRHF.jsx";
import Ej03RegistroZod from "./ejercicios/Ej03RegistroZod.jsx";
import Ej04AltaProducto from "./ejercicios/Ej04AltaProducto.jsx";
import Ej05ControllerSelect from "./ejercicios/Ej05ControllerSelect.jsx";
import Ej06RegistroAccesible from "./ejercicios/Ej06RegistroAccesible.jsx";
import Ej07FetchAMano from "./ejercicios/Ej07FetchAMano.jsx";
import Ej08TanStackQuery from "./ejercicios/Ej08TanStackQuery.jsx";
import Ej09ValidarRespuesta from "./ejercicios/Ej09ValidarRespuesta.jsx";
import Ej10Mutation from "./ejercicios/Ej10Mutation.jsx";
import Ej11Bio from "./ejercicios/Ej11Bio.jsx";
import Ej12CrudTareas from "./ejercicios/Ej12CrudTareas.jsx";

// Lista de ejercicios: el menú y el contenido salen de aquí
const EJERCICIOS = [
  { id: "01", titulo: "Input controlado", Componente: Ej01InputControlado },
  { id: "02", titulo: "Login con RHF", Componente: Ej02LoginRHF },
  { id: "03", titulo: "Registro con Zod", Componente: Ej03RegistroZod },
  { id: "04", titulo: "Alta de producto y reset", Componente: Ej04AltaProducto },
  { id: "05", titulo: "Controller + react-select", Componente: Ej05ControllerSelect },
  { id: "06", titulo: "Auditoría de accesibilidad", Componente: Ej06RegistroAccesible },
  { id: "07", titulo: "fetch a mano", Componente: Ej07FetchAMano },
  { id: "08", titulo: "TanStack Query", Componente: Ej08TanStackQuery },
  { id: "09", titulo: "Validar respuesta con Zod", Componente: Ej09ValidarRespuesta },
  { id: "10", titulo: "useMutation + invalidación", Componente: Ej10Mutation },
  { id: "11", titulo: "XSS y DOMPurify", Componente: Ej11Bio },
  { id: "12", titulo: "Integrador: CRUD de tareas", Componente: Ej12CrudTareas },
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
    window.location.hash = id;
  }

  return (
    <div className="app">
      <header className="cabecera">
        <p className="cabecera__tema">Tema 4 · Formularios y peticiones HTTP</p>
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
        {/* key: cada ejercicio se monta de cero al abrirlo */}
        <Componente key={ejercicio.id} />
      </main>
    </div>
  );
}
