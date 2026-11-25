// Ejercicio 06 · Auditoría de accesibilidad del registro del ejercicio 03
//
// Prueba de teclado (sin ratón) del 03: Tab recorre los campos en orden y Espacio marca el
// checkbox, pero al enviar con errores el foco se queda en el botón y el lector de pantalla
// no anuncia nada; los errores no están asociados a su campo y el éxito no se anuncia.
// Esta versión lo arregla:
//   1. <label htmlFor> + id en cada campo (nada de placeholders sueltos).
//   2. autocomplete donde aplica (name, email, new-password): el navegador puede rellenar.
//   3. aria-invalid y aria-describedby sacados de formState.errors.
//   4. role="alert" en cada mensaje de error: se anuncia en cuanto aparece.
//   5. setFocus al primer campo con error (en el orden visual, no en el del objeto errors).
//   6. Una región role="status" que anuncia el éxito.
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { esquemaRegistro, VALORES_INICIALES_REGISTRO } from "../esquemas/registro.js";

// Orden en que aparecen los campos en pantalla: decide a cuál se lleva el foco
const ORDEN_CAMPOS = ["nombre", "email", "edad", "password", "repetir", "aceptaTerminos"];

// Atributos ARIA de un campo según tenga error o no. ayuda: id de un texto de ayuda opcional
function ariaDe(nombre, errors, ayuda) {
  const ids = [ayuda, errors[nombre] ? `error-06-${nombre}` : null].filter(Boolean);
  return {
    "aria-invalid": errors[nombre] ? true : undefined,
    "aria-describedby": ids.length ? ids.join(" ") : undefined,
  };
}

function MensajeError({ nombre, errors }) {
  if (!errors[nombre]) return null;
  return (
    <p id={`error-06-${nombre}`} className="error" role="alert">
      {errors[nombre].message}
    </p>
  );
}

export default function Ej06RegistroAccesible() {
  const {
    register,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaRegistro),
    defaultValues: VALORES_INICIALES_REGISTRO,
    shouldFocusError: false, // el foco lo llevamos a mano con setFocus (punto 5)
  });
  const [mensajeEstado, setMensajeEstado] = useState("");

  async function onValido(datos) {
    await new Promise((r) => setTimeout(r, 800));
    setMensajeEstado(`Cuenta creada para ${datos.nombre}. Ya puedes iniciar sesión.`);
    reset();
  }

  function onInvalido(errores) {
    setMensajeEstado("");
    const primero = ORDEN_CAMPOS.find((campo) => errores[campo]);
    if (primero) setFocus(primero);
  }

  return (
    <form className="formulario" onSubmit={handleSubmit(onValido, onInvalido)} noValidate>
      <p className="nota" id="ayuda-06-obligatorios">Todos los campos son obligatorios.</p>

      <label htmlFor="r06-nombre">Nombre</label>
      <input id="r06-nombre" autoComplete="name" {...ariaDe("nombre", errors)} {...register("nombre")} />
      <MensajeError nombre="nombre" errors={errors} />

      <label htmlFor="r06-email">Email</label>
      <input id="r06-email" type="email" autoComplete="email" spellCheck={false} {...ariaDe("email", errors)} {...register("email")} />
      <MensajeError nombre="email" errors={errors} />

      <label htmlFor="r06-edad">Edad</label>
      <input id="r06-edad" type="number" inputMode="numeric" {...ariaDe("edad", errors)} {...register("edad")} />
      <MensajeError nombre="edad" errors={errors} />

      <label htmlFor="r06-password">Contraseña</label>
      <p className="nota" id="ayuda-06-password">Mínimo 8 caracteres.</p>
      <input
        id="r06-password"
        type="password"
        autoComplete="new-password"
        {...ariaDe("password", errors, "ayuda-06-password")}
        {...register("password", { deps: ["repetir"] })}
      />
      <MensajeError nombre="password" errors={errors} />

      <label htmlFor="r06-repetir">Repetir contraseña</label>
      <input id="r06-repetir" type="password" autoComplete="new-password" {...ariaDe("repetir", errors)} {...register("repetir")} />
      <MensajeError nombre="repetir" errors={errors} />

      <div className="check">
        <input id="r06-terminos" type="checkbox" {...ariaDe("aceptaTerminos", errors)} {...register("aceptaTerminos")} />
        <label htmlFor="r06-terminos">Acepto los términos</label>
      </div>
      <MensajeError nombre="aceptaTerminos" errors={errors} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando…" : "Crear cuenta"}
      </button>

      {/* La región existe siempre (vacía); así el lector de pantalla anuncia el texto cuando aparece */}
      <p role="status" className={mensajeEstado ? "exito" : undefined}>
        {mensajeEstado}
      </p>
    </form>
  );
}
