# WEB1 · Web Development I

Repositorio de las entregas de la asignatura **Web Development I** (3.º curso).
Autor: Pablo Manzanedo.

Todos los proyectos están hechos con **HTML, CSS y JavaScript puro**, sin frameworks. Los del Tema 1 se prueban abriendo su `index.html` en el navegador (o con Live Server); el del Tema 2 usa Vite como servidor de desarrollo (ver su README).

## Índice

| Tema | Proyecto | Carpeta | Descripción | Documentación |
|---|---|---|---|---|
| Tema 1 | **Cyber Memory** — Misión M1 · El Despertar del DOM | [`Tema1/El_Despertar_del_DOM/`](Tema1/El_Despertar_del_DOM/) | Juego de memoria (8 parejas) con estética de terminal: contador de intentos, cronómetro, reinicio y modo oscuro con la tecla `M`. | [README de la misión](Tema1/El_Despertar_del_DOM/README.md) |
| Tema 1 | **El oráculo de los números** | [`Tema1/Oraculo/`](Tema1/Oraculo/) | Ejercicio de adivinar un número secreto entre 1 y 100 con pistas «mayor/menor», validación de la entrada y contador de intentos. | — |
| Tema 2 | **Nevera vacía** — Misión M2 · Async Odyssey | [`Tema2/Async_Odyssey/`](Tema2/Async_Odyssey/) | Buscador de recetas por ingrediente con TheMealDB: `fetch` + `async/await`, módulos ES, `map/filter/reduce`, estados de carga/error/vacío y caché en `localStorage`. App Vite en JS puro. | [README de la misión](Tema2/Async_Odyssey/README.md) |

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
│   └── Oraculo/                   ← ejercicio de práctica
│       ├── Index.html             ← incluye los estilos en <style>
│       └── app.js
└── Tema2/
    └── Async_Odyssey/             ← Misión M2 (app Vite en JS puro)
        ├── README.md
        ├── index.html
        ├── package.json
        ├── docs/                 ← spec y plan de implementación
        └── src/                  ← api.js, logic.js, render.js, main.js, style.css
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

## Guía rápida para la corrección

1. La entrega evaluable del Tema 1 es **[`Tema1/El_Despertar_del_DOM/`](Tema1/El_Despertar_del_DOM/)**; su README contiene la explicación completa, el uso de IA y la autopsia.
2. [`Tema1/Oraculo/`](Tema1/Oraculo/) es un ejercicio de práctica previo.
3. La entrega evaluable del Tema 2 es **[`Tema2/Async_Odyssey/`](Tema2/Async_Odyssey/)**; su README contiene la explicación, el uso de IA y la autopsia.
4. Las nuevas entregas se irán añadiendo en carpetas `TemaN/` y en la tabla del índice.
