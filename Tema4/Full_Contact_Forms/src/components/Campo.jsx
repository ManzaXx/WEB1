import { idDeError } from "./aria.js";

// Etiqueta + input (children) + mensaje de error. El input recibe sus atributos aria con ariaDeCampo.
export default function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      {children}
      <MensajeError id={id} error={error} />
    </div>
  );
}

// role="alert": el lector de pantalla anuncia el error en cuanto aparece, sin ir a buscarlo
export function MensajeError({ id, error }) {
  if (!error?.message) return null;
  return (
    <p className="campo__error" id={idDeError(id)} role="alert">
      {error.message}
    </p>
  );
}
