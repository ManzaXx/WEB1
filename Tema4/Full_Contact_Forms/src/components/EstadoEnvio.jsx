import { mensajeDeError } from "../services/http.js";

// Qué pasó con la última publicación. Todo sale del estado de la mutación: no hay useState aquí.
export default function EstadoEnvio({ mutacion }) {
  if (mutacion.isError) {
    return (
      <p className="aviso aviso--error" role="alert">
        No se ha publicado: {mensajeDeError(mutacion.error)} Tus datos siguen en el formulario.
      </p>
    );
  }
  // role="status" está siempre en el DOM para que el lector de pantalla anuncie el cambio de texto
  return (
    <p className="aviso aviso--exito" role="status">
      {mutacion.isSuccess ? `«${mutacion.data.nombre}» ya está publicada en el recetario.` : ""}
    </p>
  );
}
