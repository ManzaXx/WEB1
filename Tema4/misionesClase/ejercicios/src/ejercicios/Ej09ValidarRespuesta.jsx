// Ejercicio 09 · Validar la respuesta del API con Zod dentro de la queryFn
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { obtenerPostsValidados } from "../servicios/posts.js";

// Resume un ZodError en una frase: qué campo, de qué post y qué esperaba
function describirError(error) {
  if (error instanceof z.ZodError) {
    const [primero] = error.issues;
    const [indice, campo] = primero.path;
    return `La respuesta no cumple el esquema (${error.issues.length} errores). Primero: post nº ${indice}, campo «${campo}»: ${primero.message}`;
  }
  return error.message;
}

export default function Ej09ValidarRespuesta() {
  const [romperEsquema, setRomperEsquema] = useState(false);

  // romperEsquema forma parte de la queryKey: cada variante tiene su propia entrada en la caché
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["posts", "validados", { romperEsquema }],
    queryFn: () => obtenerPostsValidados({ romperEsquema }),
  });

  return (
    <div className="ejercicio">
      <div className="check">
        <input
          id="romper-esquema"
          type="checkbox"
          checked={romperEsquema}
          onChange={(e) => setRomperEsquema(e.target.checked)}
        />
        <label htmlFor="romper-esquema">
          Romper el esquema a propósito (<code>id: z.string()</code> en vez de <code>z.number()</code>)
        </label>
      </div>

      <p className="nota">
        Estado de la query: <code>{isPending ? "isPending" : isError ? "isError" : "isSuccess"}</code>
      </p>

      {isPending && <p role="status">Cargando y validando…</p>}
      {isError && <p className="aviso-error" role="alert">{describirError(error)}</p>}
      {data && (
        <>
          <p className="exito">Los {data.length} posts cumplen el esquema.</p>
          <ul className="lista-simple">
            {data.slice(0, 3).map((p) => (
              <li key={p.id} className="post">
                <strong>{p.title}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
