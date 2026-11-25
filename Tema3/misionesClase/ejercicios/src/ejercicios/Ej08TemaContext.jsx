// Ejercicio 08 · Tema claro/oscuro con createContext y useContext
import { createContext, useContext, useState } from "react";

// 1. Crear el contexto (el valor por defecto solo se usa si no hay Provider encima)
const TemaContext = createContext({ tema: "claro", alternarTema: () => {} });

// 2. El Provider guarda el estado y lo ofrece a todo lo que tenga dentro
function ProveedorTema({ children }) {
  const [tema, setTema] = useState("claro");
  const alternarTema = () => setTema((t) => (t === "claro" ? "oscuro" : "claro"));

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>;
}

// Hijo: no recibe ni pasa el tema por props
function Pagina() {
  return (
    <div className="pagina-demo">
      <p>Página (hijo): no sabe nada del tema.</p>
      <Seccion />
    </div>
  );
}

// Nieto 1: tampoco lo pasa
function Seccion() {
  return (
    <section className="seccion-demo">
      <p>Sección (nieto): tampoco recibe el tema.</p>
      <BotonTema />
    </section>
  );
}

// Bisnieto: lee el contexto directamente, sin prop drilling
function BotonTema() {
  const { tema, alternarTema } = useContext(TemaContext);
  return (
    <button type="button" onClick={alternarTema} aria-pressed={tema === "oscuro"}>
      Tema actual: {tema}. Cambiar
    </button>
  );
}

// Lee el tema para pintar el fondo de toda la demo
function Marco({ children }) {
  const { tema } = useContext(TemaContext);
  return <div className={`marco-tema marco-tema--${tema}`}>{children}</div>;
}

export default function Ej08TemaContext() {
  return (
    <div className="ejercicio">
      <ProveedorTema>
        <Marco>
          <Pagina />
        </Marco>
      </ProveedorTema>
    </div>
  );
}
