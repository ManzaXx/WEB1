// Ejercicio 04 · Campos avanzados (select y grupo de checkbox), defaultValues y reset()
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CATEGORIAS = [
  { valor: "informatica", texto: "Informática" },
  { valor: "hogar", texto: "Hogar" },
  { valor: "deporte", texto: "Deporte" },
];

const ETIQUETAS = [
  { valor: "novedad", texto: "Novedad" },
  { valor: "oferta", texto: "Oferta" },
  { valor: "ecologico", texto: "Ecológico" },
  { valor: "envio-gratis", texto: "Envío gratis" },
];

// Valores con los que arranca el formulario y a los que vuelve reset()
const VALORES_INICIALES = {
  nombre: "",
  precio: "",
  categoria: "informatica",
  etiquetas: ["novedad"], // array: varios checkbox registrados con el mismo nombre
};

export default function Ej04AltaProducto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: VALORES_INICIALES });
  const [ultimoAlta, setUltimoAlta] = useState(null);

  // El mensaje de éxito se quita solo a los 3 s. Es un temporizador (un sistema externo),
  // así que sí es trabajo de un efecto, con su limpieza por si se desmonta antes
  useEffect(() => {
    if (!ultimoAlta) return;
    const id = setTimeout(() => setUltimoAlta(null), 3000);
    return () => clearTimeout(id);
  }, [ultimoAlta]);

  async function onSubmit(datos) {
    await new Promise((r) => setTimeout(r, 800)); // envío simulado
    setUltimoAlta(datos);
    reset(); // sin argumentos vuelve a VALORES_INICIALES
  }

  return (
    <form className="formulario" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="producto-nombre">Nombre del producto</label>
      <input id="producto-nombre" autoComplete="off" {...register("nombre", { required: "El nombre es obligatorio" })} />
      {errors.nombre && <p className="error">{errors.nombre.message}</p>}

      <label htmlFor="producto-precio">Precio (€)</label>
      <input
        id="producto-precio"
        type="number"
        inputMode="decimal"
        step="0.01"
        {...register("precio", {
          required: "El precio es obligatorio",
          valueAsNumber: true, // RHF lo entrega como número, no como string
          min: { value: 0.01, message: "El precio tiene que ser mayor que 0" },
        })}
      />
      {errors.precio && <p className="error">{errors.precio.message}</p>}

      <label htmlFor="producto-categoria">Categoría</label>
      <select id="producto-categoria" {...register("categoria")}>
        {CATEGORIAS.map((c) => (
          <option key={c.valor} value={c.valor}>
            {c.texto}
          </option>
        ))}
      </select>

      <fieldset className="grupo-checks">
        <legend>Etiquetas</legend>
        {ETIQUETAS.map((e) => (
          <label key={e.valor} className="check">
            <input type="checkbox" value={e.valor} {...register("etiquetas")} />
            {e.texto}
          </label>
        ))}
      </fieldset>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : "Dar de alta"}
      </button>

      <div role="status">
        {ultimoAlta && (
          <p className="exito">
            Producto «{ultimoAlta.nombre}» dado de alta. Datos enviados:{" "}
            <code>{JSON.stringify(ultimoAlta)}</code>
          </p>
        )}
      </div>
    </form>
  );
}
