import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCrearReceta } from "../queries/recetas.js";
import { CATEGORIAS, DIFICULTADES, esquemaReceta, RECETA_VACIA } from "../schemas/receta.js";
import { ariaDeCampo, idDeError } from "./aria.js";
import Campo, { MensajeError } from "./Campo.jsx";
import CamposIngredientes from "./CamposIngredientes.jsx";
import EstadoEnvio from "./EstadoEnvio.jsx";
import VistaPrevia from "./VistaPrevia.jsx";

// Formulario NO controlado: los inputs nativos usan register (sin Controller ni useState por campo).
// Toda la validación la hace Zod a través de zodResolver; el HTML lleva noValidate.
export default function FormularioReceta() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, submitCount },
  } = useForm({
    resolver: zodResolver(esquemaReceta),
    defaultValues: RECETA_VACIA,
    mode: "onTouched", // valida al salir de un campo y, desde entonces, mientras se corrige
  });
  const crear = useCrearReceta();

  // datos ya viene limpio de Zod (con trim aplicado); solo se publica si pasó la validación
  const publicar = handleSubmit((datos) => {
    crear.mutate(datos, { onSuccess: () => reset() });
  });

  // Ctrl/⌘ + Enter publica desde el textarea, donde Enter solo hace salto de línea
  function publicarConAtajo(evento) {
    if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) publicar();
  }

  const camposConError = Object.keys(errors).length;

  return (
    <section className="panel formulario" aria-labelledby="titulo-formulario">
      <h2 id="titulo-formulario">Publica tu receta</h2>

      <form onSubmit={publicar} noValidate>
        <div className="formulario__fila">
          <Campo id="nombre" etiqueta="Nombre de la receta" error={errors.nombre}>
            <input type="text" autoComplete="off" {...ariaDeCampo("nombre", errors.nombre)} {...register("nombre")} />
          </Campo>
          <Campo id="autor" etiqueta="Tu nombre o alias" error={errors.autor}>
            <input type="text" autoComplete="nickname" {...ariaDeCampo("autor", errors.autor)} {...register("autor")} />
          </Campo>
        </div>

        <div className="formulario__fila">
          <Campo id="categoria" etiqueta="Categoría" error={errors.categoria}>
            <select {...ariaDeCampo("categoria", errors.categoria)} {...register("categoria")}>
              <option value="">Elige…</option>
              {CATEGORIAS.map((categoria) => (
                <option key={categoria}>{categoria}</option>
              ))}
            </select>
          </Campo>

          <fieldset
            className="campo opciones"
            role="radiogroup"
            aria-labelledby="dificultad-titulo"
            aria-invalid={errors.dificultad ? true : undefined}
            aria-describedby={errors.dificultad ? idDeError("dificultad") : undefined}
          >
            <legend className="campo__etiqueta" id="dificultad-titulo">
              Dificultad
            </legend>
            <div className="opciones__lista">
              {DIFICULTADES.map((dificultad) => (
                <label key={dificultad} className="opcion">
                  <input type="radio" value={dificultad} {...register("dificultad")} />
                  {dificultad}
                </label>
              ))}
            </div>
            <MensajeError id="dificultad" error={errors.dificultad} />
          </fieldset>
        </div>

        <div className="formulario__fila formulario__fila--numeros">
          <Campo id="raciones" etiqueta="Raciones" error={errors.raciones}>
            <input type="number" inputMode="numeric" {...ariaDeCampo("raciones", errors.raciones)} {...register("raciones", { valueAsNumber: true })} />
          </Campo>
          <Campo id="minutos" etiqueta="Minutos en total" error={errors.minutos}>
            <input type="number" inputMode="numeric" {...ariaDeCampo("minutos", errors.minutos)} {...register("minutos", { valueAsNumber: true })} />
          </Campo>
          <label className="casilla">
            <input type="checkbox" {...register("vegana")} />
            Receta vegana
          </label>
        </div>

        <CamposIngredientes control={control} register={register} errores={errors.ingredientes} />

        <Campo id="pasos" etiqueta="Cómo se hace" error={errors.pasos}>
          <textarea rows={5} onKeyDown={publicarConAtajo} {...ariaDeCampo("pasos", errors.pasos)} {...register("pasos")} />
        </Campo>

        <VistaPrevia control={control} />

        {submitCount > 0 && camposConError > 0 && (
          <p className="formulario__resumen" role="alert">
            Revisa {camposConError === 1 ? "el campo marcado" : `los ${camposConError} campos marcados`} antes de publicar.
          </p>
        )}

        <div className="formulario__acciones">
          <button type="submit" className="boton boton--principal" disabled={crear.isPending}>
            {crear.isPending ? "Publicando…" : "Publicar receta"}
          </button>
          <button type="button" className="boton" onClick={() => reset()} disabled={crear.isPending}>
            Vaciar
          </button>
        </div>

        <EstadoEnvio mutacion={crear} />
      </form>
    </section>
  );
}
