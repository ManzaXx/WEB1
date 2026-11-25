// Ejercicio 08 · El 07 migrado a TanStack Query (el QueryClientProvider está en main.jsx)
import { useQuery } from "@tanstack/react-query";
import { obtenerPosts } from "../servicios/posts.js";

// Toda la lógica de petición en una línea: sin useState, sin useEffect, sin flag ignorar
function usePosts() {
  return useQuery({ queryKey: ["posts"], queryFn: obtenerPosts });
}

function ListaPosts() {
  const { isPending, isError, error, data } = usePosts();

  if (isPending) return <p role="status">Cargando posts…</p>;
  if (isError) return <p className="aviso-error" role="alert">{error.message}</p>;

  return (
    <ul className="lista-simple">
      {data.slice(0, 5).map((p) => (
        <li key={p.id} className="post">
          <strong>{p.title}</strong>
        </li>
      ))}
    </ul>
  );
}

// Segundo componente con la MISMA queryKey: TanStack Query ve que ya hay una petición en
// marcha para ["posts"] y la comparte (dedupe). En Network sale una sola petición.
function ContadorPosts() {
  const { data, isPending, dataUpdatedAt } = usePosts();
  if (isPending) return <p className="nota">Contando…</p>;
  return (
    <p className="nota">
      Otro componente, misma query: {data.length} posts (actualizados a las{" "}
      {new Date(dataUpdatedAt).toLocaleTimeString("es-ES")}).
    </p>
  );
}

export default function Ej08TanStackQuery() {
  return (
    <div className="ejercicio">
      <ContadorPosts />
      <ListaPosts />
      <section className="apunte">
        <h3>Comparación con el ejercicio 07</h3>
        <ul>
          <li>Del efecto con tres estados se pasa a una llamada a <code>useQuery</code>; <code>isPending</code>, <code>isError</code> y <code>data</code> los da la librería.</li>
          <li>Los dos componentes piden <code>["posts"]</code> y en F12 → Network solo aparece una petición a <code>/posts</code>.</li>
          <li>Además trae caché (30 s de <code>staleTime</code>), reintentos y recarga al volver a la pestaña, que en el 07 habría que programar.</li>
        </ul>
      </section>
    </div>
  );
}
