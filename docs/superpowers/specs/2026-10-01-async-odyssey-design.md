# Async Odyssey · «Nevera vacía» — Diseño

Misión M2 de Web Development I. App Vite (JS puro) que consume TheMealDB con `fetch` + `async/await`, transforma los datos con `map/filter/reduce` y los pinta en el DOM con estados de carga, error y vacío.

## Objetivo y criterios de éxito

Cubrir el 100 % de la rúbrica con el código más corto y fácil de explicar en la defensa oral (la IA hará 3 preguntas sobre el código).

| Rúbrica | Pts | Cómo se cumple |
|---|---|---|
| Checks automáticos | 30 | README con «Uso de IA», `.gitignore` (`node_modules/`, `dist/`), ≥ 5 commits, `vite` en `package.json`, archivos `.js`, estructura clara |
| Asincronía | 20 | `async/await` + `try/catch` + `response.ok` en cada petición; estados cargando/error/vacío visibles |
| Transformación | 15 | `map`, `filter`, `reduce` sin bucles a mano |
| Módulos | 15 | `api.js`, `logic.js`, `render.js`, `main.js` con una responsabilidad cada uno |
| Robustez | 10 | `meals: null`, red caída, campos vacíos, entrada vacía |
| Originalidad | 10 | Tema «cocina» propio |
| Bonus | — | Caché en `localStorage` |

## Alcance

Tres funciones, nada más:

1. Buscar recetas por ingrediente (`filter.php?i=`).
2. Ver el detalle de una receta (`lookup.php?i=`): ingredientes con medida y pasos.
3. Mostrar estados: cargando, error, vacío.

Fuera de alcance: categorías, receta aleatoria, favoritos, paginación, agrupar por entrante/plato/postre (la API de búsqueda no devuelve la categoría).

## Ubicación y tecnología

- Carpeta: `Tema2/Async_Odyssey/` dentro del repo `WEB1`.
- Vite con plantilla `vanilla` (JS puro, sin React ni TypeScript).
- `mi-app/` (plantilla React) **no se toca ni se borra**.
- API: `https://www.themealdb.com/api/json/v1/1/` (sin clave).

## Estructura

```
Tema2/Async_Odyssey/
├── index.html
├── package.json
├── .gitignore          ← node_modules/, dist/
├── README.md           ← uso de IA, decisiones, autopsia
└── src/
    ├── api.js
    ├── logic.js
    ├── render.js
    ├── main.js
    └── style.css
```

### `api.js` (red, sin DOM)
- `pedir(url)`: comprueba la caché de `localStorage`; si no está, hace `fetch`, valida `respuesta.ok` (si no, `throw new Error`), guarda y devuelve el JSON.
- `buscarPorIngrediente(ingrediente)` → array de recetas crudas (`[]` si `meals` es `null`).
- `obtenerReceta(id)` → receta cruda o `null`.
- Los errores se propagan; `api.js` no los muestra.

### `logic.js` (datos, sin DOM ni red)
- `normalizarLista(crudas)`: `map` a `{ id, nombre, imagen }`.
- `agruparPorLetra(recetas)`: `reduce` a `{ A: [...], B: [...] }`.
- `normalizarReceta(cruda)`: extrae ingredientes con `Object.keys(...).filter(...).map(...)` emparejando `strIngredientN` con `strMeasureN`; descarta vacíos/`null`; pasos con `split` + `filter` + `map`.

### `render.js` (DOM, sin red)
- `pintarCargando()`, `pintarError(mensaje)`, `pintarVacio(texto)`.
- `pintarGrupos(grupos)`: secciones por letra con tarjetas.
- `pintarDetalle(receta)`: ficha con foto, ingredientes y pasos.
- Usa `createElement` y `textContent` (nunca `innerHTML`, como en la misión anterior).

### `main.js` (orquestación)
- Evento `submit` del formulario: valida el texto (`trim`, no vacío) → `pintarCargando()` → `try { buscar → normalizar → agrupar → pintar } catch { pintarError }`.
- Delegación de eventos en la lista: al pulsar una tarjeta, mismo flujo para el detalle.

## Flujo de datos

`submit` → `main` → `api.buscarPorIngrediente` → `logic.normalizarLista` → `logic.agruparPorLetra` → `render.pintarGrupos`. Si la lista queda vacía, `render.pintarVacio`; si hay excepción, `render.pintarError`.

## Manejo de errores y robustez

- `response.ok` falso o fallo de red → excepción en `api.js` → mensaje visible en `main`/`render`.
- `meals: null` → lista vacía → estado «vacío».
- Ingredientes `null`, `""` o con solo espacios → descartados por `filter`.
- Entrada vacía → no se hace petición; se avisa al usuario.
- Datos de caché corruptos (`JSON.parse` falla) → se ignoran y se vuelve a pedir.

## Estilo «cocina»

Fondo crema, tarjetas tipo ficha de recetario, tipografía con serif, paleta terracota y verde oliva. Diseño responsive sencillo con CSS grid. Sin referencias al estilo terminal del Cyber Memory.

## Plan de commits (≥ 5)

1. Proyecto Vite vanilla + `.gitignore` + estructura vacía.
2. `api.js` (fetch y errores).
3. `logic.js` (transformaciones).
4. `render.js` + `main.js` (estados cargando/error/vacío).
5. Estilos «cocina».
6. Caché en `localStorage`.
7. README con «Uso de IA» y autopsia.

## Verificación

- Búsqueda correcta (`chicken`) → tarjetas agrupadas por letra.
- Búsqueda sin resultados (`zzzz`) → estado vacío.
- Red cortada (modo offline en DevTools) → estado de error.
- Detalle con ingredientes limpios (sin filas vacías).
- Segunda búsqueda igual → sin petición de red (pestaña Network).
- `npm run build` sin errores; `git status` sin `node_modules/` ni `dist/`.
