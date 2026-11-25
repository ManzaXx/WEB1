// Ejercicio 09 · Validar la respuesta del API con Zod dentro de la queryFn
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { obtenerPostsValidados } from "../servicios/posts.js";

export default function Ej09ValidarRespuesta() {
  const [romperEsquema, setRomperEsquema] = useState(false);

  // romperEsquema forma parte de la queryKey: cada variante tiene su propia entrada en la caché
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["posts", "validados", romperEsquema],
    queryFn: () => obtenerPostsValidados({ romperEsquema }),
    retry: false, // si los datos no cumplen el esquema, reintentar no lo arregla
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

      {isPending && <p role="status">Cargando y validando…</p>}
      {isError && (
        <p className="aviso-error" role="alert">
          isError: la respuesta no cumple el esquema. Primer error: {error.issues?.[0]?.message ?? error.message}
        </p>
      )}
      {data && <p className="exito">isSuccess: los {data.length} posts cumplen el esquema.</p>}
    </div>
  );
}
