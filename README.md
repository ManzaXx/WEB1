# WEB1 · Web Development I

Repositorio de las entregas de la asignatura **Web Development I** (3.º curso).
Autor: Pablo Manzanedo.

Los proyectos de los Temas 1 y 2 están hechos con **HTML, CSS y JavaScript puro**, sin frameworks; el del Tema 3 usa **React 19**. Los del Tema 1 se prueban abriendo su `index.html` en el navegador (o con Live Server); los de los Temas 2 y 3 usan Vite como servidor de desarrollo (ver su README).

Cada tema tiene además una carpeta **`misionesClase/`** con la lista de ejercicios y misiones de clase del tema, que se irán subiendo a medida que se hagan.

## Índice

| Tema | Proyecto | Carpeta | Descripción | Documentación |
|---|---|---|---|---|
| Tema 1 | **Cyber Memory** — Misión M1 · El Despertar del DOM | [`Tema1/El_Despertar_del_DOM/`](Tema1/El_Despertar_del_DOM/) | Juego de memoria (8 parejas) con estética de terminal: contador de intentos, cronómetro, reinicio y modo oscuro con la tecla `M`. | [README de la misión](Tema1/El_Despertar_del_DOM/README.md) |
| Tema 1 | **El oráculo de los números** | [`Tema1/Oraculo/`](Tema1/Oraculo/) | Ejercicio de adivinar un número secreto entre 1 y 100 con pistas «mayor/menor», validación de la entrada y contador de intentos. | — |
| Tema 2 | **Nevera vacía** — Misión M2 · Async Odyssey | [`Tema2/Async_Odyssey/`](Tema2/Async_Odyssey/) | Buscador de recetas por ingrediente con TheMealDB: `fetch` + `async/await`, módulos ES, `map/filter/reduce`, estados de carga/error/vacío y caché en `localStorage`. App Vite en JS puro. | [README de la misión](Tema2/Async_Odyssey/README.md) |
| Tema 3 | **Nevera vacía · React** — Misión M3 · Reactor Core | [`Tema3/Reactor_Core/`](Tema3/Reactor_Core/) | La nevera de la M2 en React 19 + Vite: llenas la nevera con hasta 5 ingredientes y salen primero las recetas que aprovechan más, con % de la receta, sustitutos, lista de la compra y favoritos. Custom hooks `useFetch` y `useLocalStorage` y tests con Vitest. | [README de la misión](Tema3/Reactor_Core/README.md) |
| Temas 1-3 | **Misiones de clase** | [`Tema1/misionesClase/`](Tema1/misionesClase/), [`Tema2/misionesClase/`](Tema2/misionesClase/), [`Tema3/misionesClase/`](Tema3/misionesClase/) | Ejercicios propuestos y misiones de clase de cada tema, como lista para ir subiéndolos. | README de cada carpeta |

## Estructura del repositorio

```
WEB1/
├── README.md                      ← este índice
├── Tema1/
│   ├── El_Despertar_del_DOM/      ← Misión M1 (entrega principal del Tema 1)
│   │   ├── README.md              ← uso de IA, decisiones y autopsia
│   │   ├── index.html
│   │   ├── styles.css
│   │   └── app.js
│   ├── Oraculo/                   ← ejercicio de práctica
│   │   ├── Index.html             ← incluye los estilos en <style>
│   │   └── app.js
│   └── misionesClase/             ← ejercicios de clase del Tema 1
├── Tema2/
│   ├── Async_Odyssey/             ← Misión M2 (app Vite en JS puro)
│   │   ├── README.md
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── docs/                  ← spec y plan de implementación
│   │   └── src/                   ← api.js, logic.js, render.js, main.js, style.css
│   └── misionesClase/             ← ejercicios de clase del Tema 2
└── Tema3/
    ├── Reactor_Core/              ← Misión M3 (React 19 + Vite)
    │   ├── README.md
    │   ├── index.html
    │   ├── package.json
    │   └── src/                   ← App.jsx, components/, hooks/, api/, logic/, styles/
    └── misionesClase/             ← ejercicios de clase del Tema 3
```

## Detalle por proyecto

### Tema 1 · Cyber Memory (M1 · El Despertar del DOM)

- **Archivos:** [`index.html`](Tema1/El_Despertar_del_DOM/index.html), [`styles.css`](Tema1/El_Despertar_del_DOM/styles.css), [`app.js`](Tema1/El_Despertar_del_DOM/app.js).
- **Contenidos del DOM trabajados:** selección con `querySelector`, creación de nodos con `createElement`, `classList` y `dataset`, modificación con `textContent` (nunca `innerHTML`), eventos con `addEventListener` y delegación en el tablero.
- **Uso de IA y autopsia:** están documentados en su [README](Tema1/El_Despertar_del_DOM/README.md), en los apartados «Uso de IA» y «Autopsia».
- **Historial:** el desarrollo por fases se puede seguir en los commits (HTML → CSS → JS → mejoras → revisión final).

### Tema 1 · El oráculo de los números

- **Archivos:** [`Index.html`](Tema1/Oraculo/Index.html) (estructura y estilos) y [`app.js`](Tema1/Oraculo/app.js) (lógica).
- **Qué hace:** genera un número secreto con `Math.random()`, valida que la entrada no esté vacía y esté entre 1 y 100, da pistas con `textContent`, cuenta los intentos y desactiva el botón al acertar.

### Tema 2 · Nevera vacía (M2 · Async Odyssey)

- **Archivos:** [`index.html`](Tema2/Async_Odyssey/index.html), [`package.json`](Tema2/Async_Odyssey/package.json) y, en `src/`, [`api.js`](Tema2/Async_Odyssey/src/api.js), [`logic.js`](Tema2/Async_Odyssey/src/logic.js), [`render.js`](Tema2/Async_Odyssey/src/render.js), [`main.js`](Tema2/Async_Odyssey/src/main.js) y [`style.css`](Tema2/Async_Odyssey/src/style.css).
- **Qué hace:** busca recetas por ingrediente en [TheMealDB](https://www.themealdb.com/api.php), las agrupa por letra inicial y, al pulsar una, muestra sus ingredientes y su preparación.
- **Contenidos trabajados:** `fetch` con `async/await`, `try/catch` y `response.ok`; `map`/`filter`/`reduce` para transformar los datos antes de pintarlos; módulos ES separados en API, lógica y render; estados de carga, error y vacío; caché en `localStorage` (bonus).
- **Cómo probarlo:** necesita Vite: `cd Tema2/Async_Odyssey`, `npm install` y `npm run dev`.
- **Uso de IA y autopsia:** están documentados en su [README](Tema2/Async_Odyssey/README.md), en los apartados «Uso de IA» y «Autopsia». El diseño y el plan de implementación están en [`docs/`](Tema2/Async_Odyssey/docs/).
- **Historial:** el desarrollo por fases se puede seguir en los commits (Vite → API → lógica → render y estados → estilos → caché → README).

### Tema 3 · Nevera vacía · React (M3 · Reactor Core)

- **Archivos:** [`src/App.jsx`](Tema3/Reactor_Core/src/App.jsx) (estado compartido), 14 componentes en [`src/components/`](Tema3/Reactor_Core/src/components/), los custom hooks [`useFetch`](Tema3/Reactor_Core/src/hooks/useFetch.js) y [`useLocalStorage`](Tema3/Reactor_Core/src/hooks/useLocalStorage.js), la red en [`src/api/`](Tema3/Reactor_Core/src/api/) y la lógica pura en [`src/logic/recetas.js`](Tema3/Reactor_Core/src/logic/recetas.js).
- **Qué hace:** con los ingredientes que tienes (hasta 5) pide a TheMealDB las recetas de cada uno en paralelo, las combina y las agrupa por cuántos de tus ingredientes usan. En el detalle enseña el % de la receta que puedes hacer, marca lo que ya tienes o puedes sustituir y copia la lista de la compra con lo que falta. Favoritos y nevera se guardan en `localStorage`.
- **Contenidos trabajados:** componentes pequeños con props y callbacks; estado mínimo levantado a `App` y todo lo demás derivado en el render; `useEffect` solo para sincronizar con la API, `localStorage`, el evento `storage` y `dialog.showModal()`, con `AbortController` y `removeEventListener` en la limpieza; listas con `key` estables; custom hooks (bonus); 16 tests de la lógica pura con Vitest (`npm test`).
- **Mejoras respecto a la M2:** cancelación de peticiones, errores de red / HTTP / datos distinguidos, caché con caducidad en su propio módulo y foco devuelto al cerrar el detalle.
- **Cómo probarlo:** `cd Tema3/Reactor_Core`, `npm install` y `npm run dev`.
- **Uso de IA y autopsia:** en su [README](Tema3/Reactor_Core/README.md).
- **Historial:** el desarrollo por fases se puede seguir en los commits (proyecto → red → lógica → hooks → componentes → detalle → estilos → README).

### Misiones de clase

Cada tema tiene una carpeta `misionesClase/` con un README que lista los ejercicios propuestos del tema y las misiones de clase (code review, boss fights, retos del cuaderno). Cada ejercicio se subirá en su propia subcarpeta y se marcará en la lista.

## Guía rápida para la corrección

1. La entrega evaluable del Tema 1 es **[`Tema1/El_Despertar_del_DOM/`](Tema1/El_Despertar_del_DOM/)**; su README contiene la explicación completa, el uso de IA y la autopsia.
2. [`Tema1/Oraculo/`](Tema1/Oraculo/) es un ejercicio de práctica previo.
3. La entrega evaluable del Tema 2 es **[`Tema2/Async_Odyssey/`](Tema2/Async_Odyssey/)**; su README contiene la explicación, el uso de IA y la autopsia.
4. La entrega evaluable del Tema 3 es **[`Tema3/Reactor_Core/`](Tema3/Reactor_Core/)**; su README contiene los componentes, el estado, los efectos, el uso de IA y la autopsia.
5. Las carpetas `TemaN/misionesClase/` son ejercicios de clase, no entregas de misión.
6. Las nuevas entregas se irán añadiendo en carpetas `TemaN/` y en la tabla del índice.
