# Misiones de clase · Tema 4 (Formularios y peticiones HTTP)

Aquí van los ejercicios y misiones que se hacen en clase durante el Tema 4 (U4: React Hook Form, Zod, formularios accesibles, `fetch`, TanStack Query, CORS y seguridad en el cliente). La entrega evaluable del tema es la M4, que está en [`../Full_Contact_Forms/`](../Full_Contact_Forms/).

Lo más cómodo es un único proyecto Vite + React para todos los ejercicios, con un componente por ejercicio en `src/ejercicios/`. Recuerda el `.gitignore` con `node_modules/`, `dist/` y `.env`. Marca la casilla cuando esté subido.

Están en [`ejercicios/`](./ejercicios/): `npm install` y `npm run dev`; el 12 necesita además `.env` (copiado de `.env.example`) y `npm run api`. Detalles en su [README](./ejercicios/README.md).

## Ejercicios propuestos del tema (apuntes de la U4, págs. 37-39)

- [x] [01](./ejercicios/src/ejercicios/Ej01InputControlado.jsx) · Input controlado básico: contador de caracteres y el texto en mayúsculas en tiempo real
- [x] [02](./ejercicios/src/ejercicios/Ej02LoginRHF.jsx) · Login con React Hook Form sin Zod: `required`, `minLength`, `pattern` para el email y botón con `isSubmitting`
- [x] [03](./ejercicios/src/ejercicios/Ej03RegistroZod.jsx) · Registro validado con Zod y `zodResolver`: edad ≥ 18 con `z.coerce.number()` y contraseñas iguales con `.refine`
- [x] [04](./ejercicios/src/ejercicios/Ej04AltaProducto.jsx) · Alta de producto: `select` de categoría, checkbox de etiquetas (array), `defaultValues`, `reset()` y éxito durante 3 s
- [x] [05](./ejercicios/src/ejercicios/Ej05ControllerSelect.jsx) · `Controller` con un componente de terceros (`react-select`) obligatorio
- [x] [06](./ejercicios/src/ejercicios/Ej06RegistroAccesible.jsx) · Auditoría de accesibilidad del 03: solo teclado, `autocomplete`, `aria-invalid` + `aria-describedby`, `role="alert"`, `setFocus` y `role="status"`
- [x] [07](./ejercicios/src/ejercicios/Ej07FetchAMano.jsx) · `fetch` a mano: `obtenerPosts()` de JSONPlaceholder consumido con `useEffect` (cargando, error y datos)
- [x] [08](./ejercicios/src/ejercicios/Ej08TanStackQuery.jsx) · Migración a TanStack Query: el 07 con `useQuery` y dos componentes con la misma `queryKey` (dedupe)
- [x] [09](./ejercicios/src/ejercicios/Ej09ValidarRespuesta.jsx) · Validar la respuesta con Zod (`.parse()` en la `queryFn`) y romper el esquema a propósito
- [x] [10](./ejercicios/src/ejercicios/Ej10Mutation.jsx) · `useMutation` + invalidación de `["posts"]` con feedback de carga, error y éxito
- [x] [11](./ejercicios/src/ejercicios/Ej11Bio.jsx) · XSS y dónde vive el token: componente `Bio`, `dangerouslySetInnerHTML` y DOMPurify
- [x] [12](./ejercicios/src/ejercicios/Ej12CrudTareas.jsx) · Integrador: mini-app CRUD de tareas con `useQuery`, formulario RHF + Zod, `useMutation` (crear y borrar), `VITE_API_URL` y capa de servicios
