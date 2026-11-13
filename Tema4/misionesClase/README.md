# Misiones de clase · Tema 4 (Formularios y peticiones HTTP)

Aquí van los ejercicios y misiones que se hacen en clase durante el Tema 4 (U4: React Hook Form, Zod, formularios accesibles, `fetch`, TanStack Query, CORS y seguridad en el cliente). La entrega evaluable del tema es la M4, que está en [`../Full_Contact_Forms/`](../Full_Contact_Forms/).

Lo más cómodo es un único proyecto Vite + React para todos los ejercicios, con un componente por ejercicio en `src/ejercicios/`. Recuerda el `.gitignore` con `node_modules/`, `dist/` y `.env`. Marca la casilla cuando esté subido.

## Ejercicios propuestos del tema (apuntes de la U4, págs. 37-39)

- [ ] 01 · Input controlado básico: contador de caracteres y el texto en mayúsculas en tiempo real
- [ ] 02 · Login con React Hook Form sin Zod: `required`, `minLength`, `pattern` para el email y botón con `isSubmitting`
- [ ] 03 · Registro validado con Zod y `zodResolver`: edad ≥ 18 con `z.coerce.number()` y contraseñas iguales con `.refine`
- [ ] 04 · Alta de producto: `select` de categoría, checkbox de etiquetas (array), `defaultValues`, `reset()` y éxito durante 3 s
- [ ] 05 · `Controller` con un componente de terceros (`react-select`) obligatorio
- [ ] 06 · Auditoría de accesibilidad del 03: solo teclado, `autocomplete`, `aria-invalid` + `aria-describedby`, `role="alert"`, `setFocus` y `role="status"`
- [ ] 07 · `fetch` a mano: `obtenerPosts()` de JSONPlaceholder consumido con `useEffect` (cargando, error y datos)
- [ ] 08 · Migración a TanStack Query: el 07 con `useQuery` y dos componentes con la misma `queryKey` (dedupe)
- [ ] 09 · Validar la respuesta con Zod (`.parse()` en la `queryFn`) y romper el esquema a propósito
- [ ] 10 · `useMutation` + invalidación de `["posts"]` con feedback de carga, error y éxito
- [ ] 11 · XSS y dónde vive el token: componente `Bio`, `dangerouslySetInnerHTML` y DOMPurify
- [ ] 12 · Integrador: mini-app CRUD de tareas con `useQuery`, formulario RHF + Zod, `useMutation` (crear y borrar), `VITE_API_URL` y capa de servicios
