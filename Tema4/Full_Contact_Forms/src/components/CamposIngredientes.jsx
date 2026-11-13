import { useFieldArray } from "react-hook-form";
import { MAX_INGREDIENTES, MIN_INGREDIENTES } from "../schemas/receta.js";
import { ariaDeCampo } from "./aria.js";
import { MensajeError } from "./Campo.jsx";
import SugerenciasIngredientes, { ID_SUGERENCIAS } from "./SugerenciasIngredientes.jsx";

const INGREDIENTE_VACIO = { nombre: "", cantidad: "" };

// Lista dinámica de ingredientes con useFieldArray. Cada fila usa register como los demás campos.
export default function CamposIngredientes({ control, register, errores }) {
  const { fields, append, remove } = useFieldArray({ control, name: "ingredientes" });
  // El error de la lista entera (mínimo o máximo) llega en .root cuando hay field array
  const errorDeLista = errores?.root ?? errores;

  return (
    <fieldset className="campo ingredientes">
      <legend className="campo__etiqueta">
        Ingredientes <span className="ingredientes__cuenta">{fields.length} de {MAX_INGREDIENTES}</span>
      </legend>
      <SugerenciasIngredientes />

      <ol className="ingredientes__lista">
        {fields.map((campo, indice) => (
          // campo.id lo genera RHF: es estable aunque se borren filas de en medio
          <FilaIngrediente
            key={campo.id}
            indice={indice}
            register={register}
            error={errores?.[indice]}
            puedeQuitarse={fields.length > MIN_INGREDIENTES}
            onQuitar={() => remove(indice)}
          />
        ))}
      </ol>

      <MensajeError id="ingredientes" error={errorDeLista} />

      <button
        type="button"
        className="boton boton--secundario"
        onClick={() => append(INGREDIENTE_VACIO)}
        disabled={fields.length >= MAX_INGREDIENTES}
      >
        Añadir ingrediente
      </button>
    </fieldset>
  );
}

function FilaIngrediente({ indice, register, error, puedeQuitarse, onQuitar }) {
  const numero = indice + 1;
  const idNombre = `ingrediente-${indice}-nombre`;
  const idCantidad = `ingrediente-${indice}-cantidad`;

  return (
    <li className="ingrediente">
      <div className="ingrediente__campos">
        <label className="sr-only" htmlFor={idNombre}>Ingrediente {numero}</label>
        <input
          type="text"
          placeholder={`Ingrediente ${numero}`}
          list={ID_SUGERENCIAS}
          autoComplete="off"
          {...ariaDeCampo(idNombre, error?.nombre)}
          {...register(`ingredientes.${indice}.nombre`)}
        />
        <label className="sr-only" htmlFor={idCantidad}>Cantidad del ingrediente {numero}</label>
        <input
          type="text"
          placeholder="Cantidad"
          className="ingrediente__cantidad"
          autoComplete="off"
          {...ariaDeCampo(idCantidad, error?.cantidad)}
          {...register(`ingredientes.${indice}.cantidad`)}
        />
        <button
          type="button"
          className="boton boton--icono"
          onClick={onQuitar}
          disabled={!puedeQuitarse}
          aria-label={`Quitar el ingrediente ${numero}`}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <MensajeError id={idNombre} error={error?.nombre} />
      <MensajeError id={idCantidad} error={error?.cantidad} />
    </li>
  );
}
