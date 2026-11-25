// Ejercicio 10 · useMutation para crear un post e invalidar la query ["posts"]
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { crearPost, obtenerPosts } from "../servicios/posts.js";

const esquemaNuevoPost = z.object({
  title: z.string().trim().min(3, "El título necesita al menos 3 caracteres"),
  body: z.string().trim().min(10, "Escribe al menos 10 caracteres"),
});

export default function Ej10Mutation() {
  const queryClient = useQueryClient();
  const posts = useQuery({ queryKey: ["posts"], queryFn: obtenerPosts });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquemaNuevoPost), defaultValues: { title: "", body: "" } });

  const mutacion = useMutation({
    mutationFn: crearPost,
    onSuccess: () => {
      // Los posts que hay en caché ya no son fiables: se marcan como viejos y se vuelven a pedir
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
    },
  });

  return (
    <div className="ejercicio">
      <form className="formulario" onSubmit={handleSubmit((datos) => mutacion.mutate(datos))} noValidate>
        <label htmlFor="post-titulo">Título</label>
        <input id="post-titulo" autoComplete="off" aria-invalid={errors.title ? true : undefined} {...register("title")} />
        {errors.title && <p className="error" role="alert">{errors.title.message}</p>}

        <label htmlFor="post-cuerpo">Texto</label>
        <textarea id="post-cuerpo" aria-invalid={errors.body ? true : undefined} {...register("body")} />
        {errors.body && <p className="error" role="alert">{errors.body.message}</p>}

        <button type="submit" disabled={mutacion.isPending}>
          {mutacion.isPending ? "Publicando…" : "Publicar post"}
        </button>

        <div role="status">
          {mutacion.isSuccess && (
            <p className="exito">
              Post creado con id {mutacion.data.id}: «{mutacion.data.title}».
            </p>
          )}
        </div>
        {mutacion.isError && <p className="aviso-error" role="alert">No se pudo publicar: {mutacion.error.message}</p>}
      </form>

      <section>
        <h3>
          Últimos posts {posts.isFetching && <span className="nota">(recargando tras invalidar…)</span>}
        </h3>
        {posts.isPending && <p>Cargando…</p>}
        {posts.data && (
          <ul className="lista-simple">
            {posts.data.slice(0, 3).map((p) => (
              <li key={p.id} className="post">
                <strong>{p.title}</strong>
              </li>
            ))}
          </ul>
        )}
        <p className="nota">
          JSONPlaceholder es un API de pruebas: responde al POST con el id 101 pero no guarda nada. Por
          eso, aunque la invalidación vuelve a pedir la lista (mira Network), el post nuevo no aparece en ella.
        </p>
      </section>
    </div>
  );
}
