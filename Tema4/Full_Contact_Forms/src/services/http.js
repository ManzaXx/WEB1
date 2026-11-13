// Capa más baja de la red: un fetch con JSON, errores con nombre y mensajes para el usuario.

export class ErrorHttp extends Error {
  constructor(estado) {
    super(`El servidor respondió con un error ${estado}`);
    this.name = "ErrorHttp";
    this.estado = estado;
  }
}

// La respuesta llegó, pero no tiene la forma que esperamos (la detecta Zod).
export class ErrorDatos extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ErrorDatos";
  }
}

export class ErrorConfiguracion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ErrorConfiguracion";
  }
}

// signal llega de TanStack Query: si la query deja de interesar, la petición se cancela.
export async function pedirJson(url, { metodo = "GET", cuerpo, signal } = {}) {
  const respuesta = await fetch(url, {
    method: metodo,
    headers: cuerpo === undefined ? undefined : { "Content-Type": "application/json" },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
    signal,
  });
  if (!respuesta.ok) throw new ErrorHttp(respuesta.status);
  return respuesta.json();
}

// Un texto distinto para cada tipo de fallo, para que el usuario sepa qué hacer.
export function mensajeDeError(error) {
  if (error instanceof ErrorHttp) {
    return error.estado >= 500
      ? `El servidor ha fallado (${error.estado}). Prueba otra vez en un momento.`
      : `El servidor rechazó la petición (${error.estado}).`;
  }
  if (error instanceof ErrorDatos || error instanceof ErrorConfiguracion) return error.message;
  if (error instanceof TypeError) {
    return "No hay conexión con el servidor de recetas. ¿Está lanzado «npm run api»?";
  }
  return "Algo ha ido mal. Prueba otra vez.";
}
