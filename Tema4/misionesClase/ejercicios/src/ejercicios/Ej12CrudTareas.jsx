// Ejercicio 12 (integrador) · Mini-app CRUD de tareas
// useQuery para la lista, formulario RHF + Zod que crea con useMutation, borrado con otra
// mutación, URL base en VITE_API_URL y servicios separados en ../servicios/tareas.js.
// Necesita el API local: `npm run api` en otra terminal.
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { borrarTarea, crearTarea, listarTareas } from "../servicios/tareas.js";

const CLAVE_TAREAS = ["tareas"];

const esquemaNuevaTarea = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, "La tarea necesita al menos 3 caracteres")
    .max(80, "Máximo 80 caracteres"),
});

function FormularioTarea() {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(esquemaNuevaTarea), defaultValues: { titulo: "" } });

  const crear = useMutation({
    mutationFn: crearTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLAVE_TAREAS });
      reset();
    },
  });

  return (
    <form className="formulario" onSubmit={handleSubmit((datos) => crear.mutate(datos))} noValidate>
      <label htmlFor="tarea-titulo">Nueva tarea</label>
      <div className="fila">
        <input
          id="tarea-titulo"
          autoComplete="off"
          aria-invalid={errors.titulo ? true : undefined}
          aria-describedby={errors.titulo ? "error-tarea-titulo" : undefined}
          {...register("titulo")}
        />
        <button type="submit" disabled={crear.isPending}>
          {crear.isPending ? "Creando…" : "Crear"}
        </button>
      </div>
      {errors.titulo && (
        <p id="error-tarea-titulo" className="error" role="alert">
          {errors.titulo.message}
        </p>
      )}
      {crear.isError && <p className="aviso-error" role="alert">No se pudo crear: {crear.error.message}</p>}
    </form>
  );
}

function ListaTareas() {
  const queryClient = useQueryClient();
  const { isPending, isError, error, data } = useQuery({ queryKey: CLAVE_TAREAS, queryFn: listarTareas });

  const borrar = useMutation({
    mutationFn: borrarTarea,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLAVE_TAREAS }),
  });

  if (isPending) return <p role="status">Cargando tareas…</p>;
  if (isError) {
    return (
      <p className="aviso-error" role="alert">
        {error.message}. ¿Está arrancado el API (<code>npm run api</code>)?
      </p>
    );
  }
  if (data.length === 0) return <p className="vacio">No hay tareas. Crea la primera.</p>;

  return (
    <ul className="tareas">
      {data.map((t) => (
        <li key={t.id} className={t.hecha ? "tarea tarea--hecha" : "tarea"}>
          <span className="tarea__texto">{t.titulo}</span>
          <button
            type="button"
            className="peligro"
            onClick={() => borrar.mutate(t.id)}
            // Solo se desactiva el botón de la tarea que se está borrando
            disabled={borrar.isPending && borrar.variables === t.id}
            aria-label={`Borrar «${t.titulo}»`}
          >
            {borrar.isPending && borrar.variables === t.id ? "Borrando…" : "Borrar"}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Ej12CrudTareas() {
  return (
    <div className="ejercicio">
      <p className="nota">
        API: <code>{import.meta.env.VITE_API_URL ?? "(falta VITE_API_URL en .env)"}</code>
      </p>
      <FormularioTarea />
      <ListaTareas />
    </div>
  );
}
