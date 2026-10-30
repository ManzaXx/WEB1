import { useLocalStorage } from "./hooks/useLocalStorage.js";
import Buscador from "./components/Buscador.jsx";
import Nevera from "./components/Nevera.jsx";

// Componente raíz: aquí vive el estado que comparten varios componentes
// (lifting state up) y se pasa hacia abajo por props.
export default function App() {
  const [nevera, setNevera] = useLocalStorage("nevera-react:ingredientes", []);

  // Actualizaciones inmutables: siempre un array nuevo, nunca push ni splice
  const anadirIngrediente = (ingrediente) => setNevera((actual) => [...actual, ingrediente]);
  const quitarIngrediente = (ingrediente) =>
    setNevera((actual) => actual.filter((guardado) => guardado !== ingrediente));

  return (
    <div className="app">
      <header className="cabecera">
        <h1>Nevera vacía</h1>
        <p>Dime qué tienes en la nevera y te digo qué cocinar.</p>
      </header>

      <main>
        <section className="puerta" aria-label="Ingredientes">
          <Buscador nevera={nevera} onAnadir={anadirIngrediente} />
          <Nevera
            ingredientes={nevera}
            onQuitar={quitarIngrediente}
            onAnadir={anadirIngrediente}
            onVaciar={() => setNevera([])}
          />
        </section>
      </main>
    </div>
  );
}
