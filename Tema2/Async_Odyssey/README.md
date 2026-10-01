# Nevera vacía

Misión M2 · Async Odyssey — Web Development I.

Buscador de recetas por ingrediente con [TheMealDB](https://www.themealdb.com/api.php). Escribes un ingrediente (en inglés), la app lista las recetas agrupadas por letra inicial y, al pulsar una, muestra sus ingredientes y su preparación. Hecho con Vite y JavaScript puro, sin frameworks.

## Cómo probarlo

```bash
cd Tema2/Async_Odyssey
npm install
npm run dev
```

Abre la URL que imprime Vite (normalmente `http://localhost:5173`). Prueba `chicken`, `egg` o `rice`; un ingrediente raro como `zzzz` enseña el estado «vacío», y poner el navegador en modo offline enseña el estado de error.

## Estructura

| Archivo | Responsabilidad |
|---|---|
| `src/api.js` | Solo red: `fetch`, `async/await`, comprobación de `response.ok` y caché en `localStorage`. |
| `src/logic.js` | Solo datos: `map`, `filter` y `reduce`. No toca el DOM ni la red. |
| `src/render.js` | Solo DOM: pinta cargando, error, vacío, la lista y el detalle con `createElement` y `textContent`. |
| `src/main.js` | Conecta todo: eventos del formulario y de la lista → API → lógica → render, con `try/catch`. |
| `src/style.css` | Tema «cocina». |

## Dónde se usa cada método de array

- `map` en `normalizarLista`: de los campos de la API (`strMeal`, `strMealThumb`) a `{ id, nombre, imagen }`.
- `filter` + `map` en `normalizarReceta`: la API da 20 campos `strIngredient1…20` y muchos vienen vacíos; se descartan los vacíos y se emparejan con su medida.
- `reduce` en `agruparPorLetra`: convierte la lista de recetas en un objeto `{ A: [...], B: [...] }`.

## Estados y errores

- **Cargando:** se pinta antes de cada petición.
- **Error:** `api.js` lanza un `Error` si falla la red o `respuesta.ok` es falso; `main.js` lo captura con `try/catch` y muestra un mensaje al usuario.
- **Vacío:** la API devuelve `meals: null` cuando no hay resultados; `api.js` lo convierte en `[]` y la app muestra «No hay recetas…». También se avisa si el campo está vacío.
- **Datos raros:** ingredientes `null` o con espacios se descartan; si no hay instrucciones, la lista de pasos queda vacía; una receta sin nombre se agrupa bajo `#`.

## Caché (bonus)

`api.js` guarda cada respuesta en `localStorage` con la URL como clave. Si la URL ya está guardada, no se repite el `fetch`. Si la caché está corrupta o `localStorage` no está disponible, se ignora y se pide a la red.

## Uso de IA

Usé Claude Code como pareja de programación para plantear, diseñar e implementar la misión.

**Qué pedí:** Le pasé a la IA el enunciado y la rúbrica, y le dije que hiciera un brainstorming; poco a poco fuimos eligiendo la mejor opción, por ejemplo la API. También le pedí que fuese lo más corta y fácil de explicar posible, que usara un tema «cocina» y que se ajustase a la rúbrica para sacar la máxima nota.

**Qué cambié o decidí yo:** Elegí TheMealDB, descarté agrupar por categoría porque exigía muchas peticiones, elegí Vite vanilla en vez de React, y pedí que la app fuese lo más simple posible para poder explicar el flujo de datos y la separación de responsabilidades.

**Qué entiendo:** La app es un buscador de recetas que hace peticiones a una API, procesa los datos y los muestra en el DOM, con estados de carga, error y vacío, y con caché para optimizar las búsquedas repetidas. El flujo es: el usuario envía el formulario → `main.js` llama a `api.js` (red) → `logic.js` transforma los datos con `map`/`filter`/`reduce` → `render.js` los pinta. Cada módulo hace una sola cosa, y si algo falla en la red, el `try/catch` de `main.js` lo captura y se lo enseña al usuario.

**Cómo lo verifiqué:** junto con la IA probamos búsquedas con resultados, sin resultados y con el campo vacío; el modo offline para el estado de error; un detalle de receta sin filas de ingredientes vacías; la pestaña Network para comprobar que una segunda búsqueda igual no repite la petición; una caché corrupta a propósito; y el ancho de móvil para ver que no hay scroll horizontal.

## Autopsia

Elegí Vite y JavaScript puro en vez de un framework como React o Vue, porque quería que la app fuera lo más simple posible para poder explicar claramente el flujo de datos y la separación de responsabilidades. Descarté agrupar por categoría porque eso requería muchas peticiones a la API, lo que complicaba el código y la experiencia del usuario. Aparte, me decanté por el estilo de cocina, que me parecía más atractivo visualmente y coherente con el tema de la app.
