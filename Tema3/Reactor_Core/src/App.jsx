import { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import Buscador from "./components/Buscador.jsx";
import Nevera from "./components/Nevera.jsx";
import Pestanas from "./components/Pestanas.jsx";
import Resultados from "./components/Resultados.jsx";
import Favoritos from "./components/Favoritos.jsx";
import Detalle from "./components/Detalle.jsx";

// Componente raíz: aquí vive el estado que comparten varios componentes
// (lifting state up) y se pasa hacia abajo por props.
export default function App() {
  const [nevera, setNevera] = useLocalStorage("nevera-react:ingredientes", []);
  const [favoritos, setFavoritos] = useLocalStorage("nevera-react:favoritos", []);
  const [vista, setVista] = useState("recetas");
  const [recetaAbierta, setRecetaAbierta] = useState(null); // id de la receta o null

  // Derivado: se recalcula en cada render a partir de `favoritos`, no es estado.
  // Sin useMemo a propósito: recorrer unas decenas de favoritos cuesta microsegundos
  // y ningún hijo está memoizado (React.memo), así que una referencia estable no ahorra nada.
  const idsFavoritos = new Set(favoritos.map((favorita) => favorita.id));

  // Actualizaciones inmutables: siempre un array nuevo, nunca push ni splice
  const anadirIngrediente = (ingrediente) => setNevera((actual) => [...actual, ingrediente]);
  const quitarIngrediente = (ingrediente) =>
    setNevera((actual) => actual.filter((guardado) => guardado !== ingrediente));

  // Recibe solo { id, nombre, imagen }: lo justo para pintar la tarjeta sin volver a pedirla
  function alternarFavorito({ id, nombre, imagen }) {
    setFavoritos((actual) =>
      actual.some((favorita) => favorita.id === id)
        ? actual.filter((favorita) => favorita.id !== id)
        : [...actual, { id, nombre, imagen }],
    );
  }

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

        <Pestanas vista={vista} totalFavoritos={favoritos.length} onCambiar={setVista} />

        {vista === "recetas" ? (
          <Resultados
            nevera={nevera}
            idsFavoritos={idsFavoritos}
            onAbrir={setRecetaAbierta}
            onAlternarFavorito={alternarFavorito}
          />
        ) : (
          <Favoritos
            favoritos={favoritos}
            idsFavoritos={idsFavoritos}
            onAbrir={setRecetaAbierta}
            onAlternarFavorito={alternarFavorito}
          />
        )}
      </main>

      {recetaAbierta && (
        <Detalle
          id={recetaAbierta}
          nevera={nevera}
          esFavorita={idsFavoritos.has(recetaAbierta)}
          onAlternarFavorito={alternarFavorito}
          onCerrar={() => setRecetaAbierta(null)}
        />
      )}

      <footer className="pie">
        Recetas de <a href="https://www.themealdb.com/">TheMealDB</a>. Misión M3 · Reactor Core.
      </footer>
    </div>
  );
}
