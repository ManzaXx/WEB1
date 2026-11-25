// Capa de servicios de los posts de JSONPlaceholder (ejercicios 07 a 10).
// Los componentes no llaman a fetch directamente: piden los datos a estas funciones.
import { z } from "zod";

const URL_POSTS = "https://jsonplaceholder.typicode.com/posts";

// Ejercicio 07: GET a mano
export async function obtenerPosts() {
  const response = await fetch(URL_POSTS);
  // fetch no rechaza con un 404 o un 500: hay que mirar ok nosotros
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al pedir los posts`);
  }
  return response.json();
}

// Ejercicio 09: esquema de un post
export const esquemaPost = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

// El mismo esquema "roto" a propósito: id como string, que no es lo que manda el API
export const esquemaPostRoto = esquemaPost.extend({ id: z.string() });

// Valida la respuesta: si un solo post no cumple el esquema, .parse lanza un ZodError
export async function obtenerPostsValidados({ romperEsquema = false } = {}) {
  const datos = await obtenerPosts();
  const esquema = romperEsquema ? esquemaPostRoto : esquemaPost;
  return z.array(esquema).parse(datos);
}

// Ejercicio 10: POST. JSONPlaceholder responde como si lo guardara (id 101), pero no lo guarda
export async function crearPost(post) {
  const response = await fetch(URL_POSTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...post, userId: 1 }),
  });
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status} al crear el post`);
  }
  return esquemaPost.parse(await response.json());
}
