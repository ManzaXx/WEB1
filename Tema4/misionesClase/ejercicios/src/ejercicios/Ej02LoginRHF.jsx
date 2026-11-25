// Ejercicio 02 · Login con React Hook Form, sin Zod: solo register y sus reglas
import { useState } from "react";
import { useForm } from "react-hook-form";

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Ej02LoginRHF() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });
  const [usuario, setUsuario] = useState(null);

  async function onSubmit(datos) {
    // Simulamos la petición al servidor; mientras dura, isSubmitting es true
    await new Promise((r) => setTimeout(r, 1000));
    setUsuario(datos.email);
  }

  return (
    // noValidate: los mensajes los pone RHF, no el navegador
    <form className="formulario" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        autoComplete="email"
        {...register("email", {
          required: "El email es obligatorio",
          pattern: { value: PATRON_EMAIL, message: "El email no tiene un formato válido" },
        })}
      />
      {errors.email && <p className="error">{errors.email.message}</p>}

      <label htmlFor="login-password">Contraseña</label>
      <input
        id="login-password"
        type="password"
        autoComplete="current-password"
        {...register("password", {
          required: "La contraseña es obligatoria",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
        })}
      />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>

      {usuario && <p className="exito">Sesión iniciada como {usuario} (simulado).</p>}
    </form>
  );
}
