import FormularioReceta from "./components/FormularioReceta.jsx";
import Listado from "./components/Listado.jsx";

// App solo reparte la pantalla: el formulario y el listado no comparten estado.
// Se comunican a través de la caché de TanStack Query (publicar invalida el listado).
export default function App() {
  return (
    <div className="app">
      <header className="cabecera">
        <h1>Recetario de la Nevera</h1>
        <p>Publica lo que cocinas con lo que tienes. Valida o muere.</p>
      </header>

      <main className="pantalla">
        <FormularioReceta />
        <Listado />
      </main>

      <footer className="pie">
        <p>Misión M4 · Full Contact Forms · Web Development I</p>
      </footer>
    </div>
  );
}
