// Ejercicio 05 · Controller con un componente de terceros (react-select)
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const LENGUAJES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "kotlin", label: "Kotlin" },
];

export default function Ej05ControllerSelect() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { lenguaje: null } });
  const [elegido, setElegido] = useState(null);

  // react-select no es un <input> normal: no admite register porque no expone un ref al
  // input ni dispara onChange con un evento. Controller hace de puente: le pasa value y
  // onChange, y RHF guarda lo que react-select le devuelve (el objeto opción entero).
  return (
    <form className="formulario" onSubmit={handleSubmit((d) => setElegido(d.lenguaje))} noValidate>
      <label htmlFor="select-lenguaje">Lenguaje favorito</label>
      <Controller
        name="lenguaje"
        control={control}
        rules={{ required: "Elige un lenguaje" }}
        render={({ field }) => (
          <Select
            {...field}
            inputId="select-lenguaje"
            options={LENGUAJES}
            placeholder="Selecciona…"
            isClearable
            aria-invalid={errors.lenguaje ? true : undefined}
            aria-errormessage={errors.lenguaje ? "error-lenguaje" : undefined}
            className="select-terceros"
            classNamePrefix="rs"
          />
        )}
      />
      {errors.lenguaje && (
        <p id="error-lenguaje" className="error">
          {errors.lenguaje.message}
        </p>
      )}

      <button type="submit">Enviar</button>

      {elegido && (
        <p className="exito">
          Has elegido {elegido.label} (valor <code>{elegido.value}</code>).
        </p>
      )}
    </form>
  );
}
