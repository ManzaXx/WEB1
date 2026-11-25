// Capa de servicios del ejercicio 12: la única parte de la app que sabe la URL del API
// y cómo se le habla. Si mañana cambia el backend, solo se toca este fichero.
import { z } from "zod";

// Vite solo expone al cliente las variables que empiezan por VITE_ (se leen de .env)
const API_URL = import.meta.env.VITE_API_URL;

export const esquemaTarea = z.object({
  id: z.string(),
  titulo: z.string(),
  hecha: z.boolean(),
});

async function pedir(ruta, opciones) {
  if (!API_URL) {
    throw new Error("Falta VITE_API_URL: copia .env.example como .env y reinicia npm run dev");
  }
  const response = await fetch(`${API_URL}${ruta}`, opciones);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} en ${ruta}`);
  }
  return response.json();
}

export async function listarTareas() {
  return z.array(esquemaTarea).parse(await pedir("/tareas"));
}

export async function crearTarea({ titulo }) {
  const creada = await pedir("/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, hecha: false }),
  });
  return esquemaTarea.parse(creada);
}

export async function borrarTarea(id) {
  return pedir(`/tareas/${encodeURIComponent(id)}`, { method: "DELETE" });
}
