# Ejercicios de clase · Tema 4 (Formularios y peticiones HTTP)

Los 12 ejercicios propuestos de la U4 (apuntes, págs. 37-39) en un único proyecto Vite + React 19 con React Hook Form, Zod, TanStack Query, react-select y DOMPurify. Cada ejercicio es un componente de [`src/ejercicios/`](src/ejercicios/), y [`src/App.jsx`](src/App.jsx) tiene un menú para abrirlos (el abierto queda en la URL, por ejemplo `#06`).

```bash
npm install
cp .env.example .env   # solo para el ejercicio 12 (VITE_API_URL)
npm run api            # solo para el ejercicio 12: json-server en http://localhost:3002
npm run dev            # en otra terminal: http://localhost:5173
```

Los ejercicios 07 a 10 piden datos a JSONPlaceholder, así que necesitan internet.

## Estructura

```
src/
├── main.jsx               ← QueryClient + QueryClientProvider (ejercicio 08)
├── App.jsx                ← menú de ejercicios
├── esquemas/registro.js   ← esquema Zod del registro (ejercicios 03 y 06)
├── servicios/
│   ├── posts.js           ← fetch a JSONPlaceholder y esquema del post (07-10)
│   └── tareas.js          ← capa de servicios del CRUD, lee VITE_API_URL (12)
└── ejercicios/            ← un componente por ejercicio
api/semilla.json           ← datos iniciales de json-server (api/db.json no se sube)
```

## Ejercicios

| Nº | Fichero | Qué se practica |
|---|---|---|
| 01 | [`Ej01InputControlado.jsx`](src/ejercicios/Ej01InputControlado.jsx) | Input controlado: nº de caracteres y mayúsculas en tiempo real |
| 02 | [`Ej02LoginRHF.jsx`](src/ejercicios/Ej02LoginRHF.jsx) | Login con `register` y reglas (`required`, `minLength`, `pattern`) y botón con `isSubmitting` |
| 03 | [`Ej03RegistroZod.jsx`](src/ejercicios/Ej03RegistroZod.jsx) | Registro de la unidad con `zodResolver`, edad ≥ 18 con `z.coerce.number()` y contraseñas iguales con `.refine` |
| 04 | [`Ej04AltaProducto.jsx`](src/ejercicios/Ej04AltaProducto.jsx) | `select`, grupo de checkbox (array), `defaultValues`, `reset()` y éxito durante 3 s |
| 05 | [`Ej05ControllerSelect.jsx`](src/ejercicios/Ej05ControllerSelect.jsx) | `Controller` con el `Select` de react-select, obligatorio |
| 06 | [`Ej06RegistroAccesible.jsx`](src/ejercicios/Ej06RegistroAccesible.jsx) | El 03 auditado: `label`, `autocomplete`, `aria-invalid` + `aria-describedby`, `role="alert"`, `setFocus` y `role="status"` (la prueba de teclado está comentada al principio del fichero) |
| 07 | [`Ej07FetchAMano.jsx`](src/ejercicios/Ej07FetchAMano.jsx) | `obtenerPosts()` con `useEffect` y los estados cargando, error y datos, y lo que resulta repetitivo |
| 08 | [`Ej08TanStackQuery.jsx`](src/ejercicios/Ej08TanStackQuery.jsx) | El 07 con `useQuery`; dos componentes con la misma `queryKey` hacen una sola petición |
| 09 | [`Ej09ValidarRespuesta.jsx`](src/ejercicios/Ej09ValidarRespuesta.jsx) | `.parse()` en la `queryFn` y un interruptor que rompe el esquema para ver `isError` |
| 10 | [`Ej10Mutation.jsx`](src/ejercicios/Ej10Mutation.jsx) | Crear un post con `useMutation` e invalidar `["posts"]`, con feedback de carga, error y éxito |
| 11 | [`Ej11Bio.jsx`](src/ejercicios/Ej11Bio.jsx) | XSS: JSX frente a `dangerouslySetInnerHTML` y el arreglo con DOMPurify |
| 12 | [`Ej12CrudTareas.jsx`](src/ejercicios/Ej12CrudTareas.jsx) | Integrador: listar, crear y borrar tareas contra json-server, con `VITE_API_URL` y servicios aparte |

## Ejercicio 11 · Dónde guardaría el token de sesión

Lo guardaría en una cookie `HttpOnly`, `Secure` y `SameSite` que pone el servidor, porque JavaScript no puede leerla y un XSS como el de la bio no podría robarla, cosa que sí pasaría si estuviera en `localStorage`. Si la aplicación tuviera que manejar el token desde el cliente, lo dejaría solo en memoria (una variable o el estado de React) y nunca en `localStorage`, aceptando que se pierde al recargar la página.
