// Ejercicio 07 · fetch a mano consumido con useEffect
import { useEffect, useState } from "react";
import { obtenerPosts } from "../servicios/posts.js";

export default function Ej07FetchAMano() {
  // Tres estados que hay que llevar a mano
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    // Si el componente se desmonta antes de que llegue la respuesta, la ignoramos.
    // En desarrollo, StrictMode monta dos veces: por eso en Network salen DOS peticiones.
    let ignorar = false;

    obtenerPosts()
      .then((posts) => {
        if (!ignorar) setDatos(posts);
      })
      .catch((err) => {
        if (!ignorar) setError(err);
      })
      .finally(() => {
        if (!ignorar) setCargando(false);
      });

    return () => {
      ignorar = true;
    };
  }, []);

  return (
    <div className="ejercicio">
      {cargando && <p role="status">Cargando posts…</p>}
      {error && <p className="aviso-error" role="alert">{error.message}</p>}
      {!cargando && !error && (
        <>
          <p className="nota">{datos.length} posts recibidos. Se muestran los 5 primeros.</p>
          <ul className="lista-simple">
            {datos.slice(0, 5).map((p) => (
              <li key={p.id} className="post">
                <strong>{p.title}</strong>
              </li>
            ))}
          </ul>
        </>
      )}

      <section className="apunte">
        <h3>Lo que resulta repetitivo</h3>
        <ul>
          <li>Tres <code>useState</code> (cargando, error y datos) que habría que copiar en cada componente que pida algo.</li>
          <li>El <code>let ignorar</code> y la limpieza del efecto para no actualizar un componente desmontado.</li>
          <li>Comprobar <code>response.ok</code> y lanzar el error a mano en cada servicio.</li>
          <li>No hay caché: si otro componente necesita los mismos posts, vuelve a pedirlos. Tampoco hay reintentos ni forma sencilla de recargar.</li>
        </ul>
      </section>
    </div>
  );
}
