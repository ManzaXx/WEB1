// Atributos que conectan un input con su mensaje de error: el lector de pantalla
// anuncia «no válido» y lee el mensaje al entrar en el campo.
export function ariaDeCampo(id, error) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? idDeError(id) : undefined,
  };
}

export function idDeError(id) {
  return `${id}-error`;
}
