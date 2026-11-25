// Ejercicio 03 · Registro validado con Zod y zodResolver (con edad y contraseñas iguales)
// La accesibilidad de este mismo formulario se trabaja en el ejercicio 06.
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { esquemaRegistro, VALORES_INICIALES_REGISTRO } from "../esquemas/registro.js";

export default function Ej03RegistroZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaRegistro), // a partir de aquí valida Zod
    defaultValues: VALORES_INICIALES_REGISTRO,
  });
  const [registrado, setRegistrado] = useState(null);

  async function onSubmit(datos) {
    await new Promise((r) => setTimeout(r, 800));
    // datos ya viene validado y transformado: edad es un número, no un string
    console.log("Datos válidos:", datos);
    setRegistrado(datos);
  }

  return (
    <form className="formulario" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        Nombre
        <input {...register("nombre")} />
      </label>
      {errors.nombre && <p className="error">{errors.nombre.message}</p>}

      <label>
        Email
        <input type="email" {...register("email")} />
      </label>
      {errors.email && <p className="error">{errors.email.message}</p>}

      <label>
        Edad
        <input type="number" inputMode="numeric" {...register("edad")} />
      </label>
      {errors.edad && <p className="error">{errors.edad.message}</p>}

      <label>
        Contraseña
        {/* deps: al cambiar password se revalida también repetir (el error del refine vive ahí) */}
        <input type="password" {...register("password", { deps: ["repetir"] })} />
      </label>
      {errors.password && <p className="error">{errors.password.message}</p>}

      <label>
        Repetir contraseña
        <input type="password" {...register("repetir")} />
      </label>
      {errors.repetir && <p className="error">{errors.repetir.message}</p>}

      <label className="check">
        <input type="checkbox" {...register("aceptaTerminos")} />
        Acepto los términos
      </label>
      {errors.aceptaTerminos && <p className="error">{errors.aceptaTerminos.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registrando…" : "Crear cuenta"}
      </button>

      {registrado && (
        <p className="exito">
          Cuenta creada para {registrado.nombre} ({registrado.edad} años, edad de tipo {typeof registrado.edad}).
        </p>
      )}
    </form>
  );
}
