// Ejercicio 09 · Carrito con useReducer
import { useReducer } from "react";

const PRODUCTOS = [
  { id: "cafe", nombre: "Café en grano 500 g", precio: 7.9 },
  { id: "leche", nombre: "Leche de avena 1 l", precio: 1.85 },
  { id: "galletas", nombre: "Galletas de avena", precio: 2.4 },
];

// El reducer reúne en un solo sitio TODAS las formas de cambiar el carrito.
// Recibe el estado actual y una acción, y devuelve el estado nuevo (sin mutar el anterior).
function carritoReducer(carrito, accion) {
  switch (accion.tipo) {
    case "anadir": {
      const existe = carrito.find((l) => l.id === accion.producto.id);
      if (existe) {
        return carrito.map((l) => (l.id === accion.producto.id ? { ...l, cantidad: l.cantidad + 1 } : l));
      }
      return [...carrito, { ...accion.producto, cantidad: 1 }];
    }
    case "quitar":
      // Resta una unidad; si llega a 0, la línea desaparece
      return carrito
        .map((l) => (l.id === accion.id ? { ...l, cantidad: l.cantidad - 1 } : l))
        .filter((l) => l.cantidad > 0);
    case "vaciar":
      return [];
    default:
      throw new Error(`Acción desconocida: ${accion.tipo}`);
  }
}

const euros = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

export default function Ej09Carrito() {
  const [carrito, dispatch] = useReducer(carritoReducer, []);

  // Derivados: no son estado, salen del carrito en cada render
  const unidades = carrito.reduce((n, l) => n + l.cantidad, 0);
  const total = carrito.reduce((suma, l) => suma + l.precio * l.cantidad, 0);

  return (
    <div className="ejercicio rejilla">
      <section>
        <h3>Productos</h3>
        <ul className="lista-simple">
          {PRODUCTOS.map((p) => (
            <li key={p.id} className="linea">
              <span>{p.nombre}</span>
              <span className="precio">{euros.format(p.precio)}</span>
              <button type="button" onClick={() => dispatch({ tipo: "anadir", producto: p })} aria-label={`Añadir ${p.nombre}`}>
                Añadir
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-live="polite">
        <h3>Carrito ({unidades} {unidades === 1 ? "unidad" : "unidades"})</h3>
        {carrito.length === 0 ? (
          <p className="vacio">El carrito está vacío.</p>
        ) : (
          <>
            <ul className="lista-simple">
              {carrito.map((l) => (
                <li key={l.id} className="linea">
                  <span>
                    {l.cantidad} × {l.nombre}
                  </span>
                  <span className="precio">{euros.format(l.precio * l.cantidad)}</span>
                  <button type="button" className="secundario" onClick={() => dispatch({ tipo: "quitar", id: l.id })} aria-label={`Quitar una unidad de ${l.nombre}`}>
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
            <p className="total">Total: {euros.format(total)}</p>
            <button type="button" className="peligro" onClick={() => dispatch({ tipo: "vaciar" })}>
              Vaciar carrito
            </button>
          </>
        )}
      </section>
    </div>
  );
}
