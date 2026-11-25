// Ejercicio 10 (reto) · Refactor anti-efecto
import { useEffect, useState } from "react";

const PRECIOS_INICIALES = [12.5, 4.99, 30];
const euros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

// ANTES (el componente que nos dan): calcula el total en un efecto y lo guarda en estado.
// Problemas:
// - Estado redundante: total se puede sacar de precios, así que son dos fuentes de verdad.
// - Render de más: React pinta con el total viejo, ejecuta el efecto, cambia el estado
//   y vuelve a pintar. Durante un instante el total que se ve está mal.
function TotalConEfecto({ precios }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // El propio linter lo detecta: oxlint avisa con react(set-state-in-effect). Lo silenciamos
    // solo aquí porque este componente es el "antes" que se enseña a propósito.
    // eslint-disable-next-line react/set-state-in-effect
    setTotal(precios.reduce((suma, p) => suma + p, 0));
  }, [precios]);

  return <p className="total">Total: {euros.format(total)}</p>;
}

// DESPUÉS: el total se calcula durante el render.
// «You Might Not Need an Effect» (react.dev): si algo se puede calcular a partir de las props
// o del estado que ya tienes, no lo pongas en estado; calcúlalo al renderizar. Los efectos son
// para sincronizar con sistemas externos (red, temporizadores, el DOM), no para transformar datos.
// Así hay un solo render, el total nunca está desfasado y el código es más corto.
function TotalDerivado({ precios }) {
  const total = precios.reduce((suma, p) => suma + p, 0);
  return <p className="total">Total: {euros.format(total)}</p>;
}

export default function Ej10AntiEfecto() {
  const [precios, setPrecios] = useState(PRECIOS_INICIALES);

  function anadirPrecio() {
    // Precio aleatorio entre 1 y 20 €, redondeado a céntimos
    const nuevo = Math.round((1 + Math.random() * 19) * 100) / 100;
    setPrecios([...precios, nuevo]);
  }

  return (
    <div className="ejercicio">
      <p>
        Precios: {precios.map((p) => euros.format(p)).join(" + ")}
      </p>
      <button type="button" onClick={anadirPrecio}>Añadir un precio</button>
      <div className="rejilla">
        <section>
          <h3>Antes · con useEffect</h3>
          <TotalConEfecto precios={precios} />
        </section>
        <section>
          <h3>Después · calculado en el render</h3>
          <TotalDerivado precios={precios} />
        </section>
      </div>
      <p className="nota">Los dos dan el mismo número, pero el segundo no necesita ni estado ni efecto.</p>
    </div>
  );
}
