# Async Odyssey · «Nevera vacía» Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** App Vite (JS puro) que busca recetas por ingrediente en TheMealDB, muestra el detalle de cada una y enseña estados de carga, error y vacío.

**Architecture:** Cuatro módulos ES con una responsabilidad cada uno: `api.js` (red + caché), `logic.js` (transformación con `map/filter/reduce`), `render.js` (DOM) y `main.js` (eventos y orquestación). Sin frameworks ni dependencias de runtime; solo `vite` como devDependency.

**Tech Stack:** Vite, JavaScript (módulos ES), `fetch`, `localStorage`, CSS. Node 24 / npm 11 disponibles.

**Spec:** [docs/2026-10-01-async-odyssey-design.md](./2026-10-01-async-odyssey-design.md)

## Global Constraints

- Carpeta del proyecto: `Tema2/Async_Odyssey/` dentro del repo `WEB1` (raíz del repo: `C:\UNI\Tercero\WEB1`).
- Vite con JS puro: archivos `.js`, **sin React ni TypeScript**. `mi-app/` no se toca ni se borra.
- API: `https://www.themealdb.com/api/json/v1/1` (sin clave).
- Cada petición: `async/await` + `try/catch` + comprobación de `respuesta.ok`.
- Transformar datos con `map`/`filter`/`reduce`; sin bucles `for`/`while` a mano.
- DOM con `createElement` y `textContent`; nunca `innerHTML`.
- `node_modules/` y `dist/` fuera del repo (`.gitignore`).
- ≥ 5 commits (aquí 7), uno por tarea. Mensajes de commit en español, terminados con la línea `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Todos los comandos se ejecutan desde `C:\UNI\Tercero\WEB1\Tema2\Async_Odyssey` salvo que se indique otra cosa.
- No hay framework de tests (sería sobreingeniería para la misión): se verifica con comprobaciones de `node` y en el navegador, como indica cada paso.

## Review Focus

Entradas que el spec no menciona y que pueden romper la app; cada una tiene su comprobación en la tarea que posee el código:

1. Receta cuyo nombre está vacío o sin `strMeal` → se agrupa bajo `#`, no explota (Tarea 3).
2. Ingrediente con espacios o varias palabras (`chicken breast`) → se convierte a `chicken_breast` en la URL, como espera la API (Tarea 2).
3. Receta con `strInstructions` `null` o saltos de línea `\r\n` → `pasos` queda como array limpio, sin líneas vacías (Tarea 3).
4. Caché de `localStorage` corrupta o `localStorage` no disponible → se ignora y se pide a la red (Tarea 6).
5. `lookup.php` devuelve `{ meals: null }` para un id inexistente → mensaje «ya no existe», no excepción (Tarea 4).

---

### Task 1: Proyecto Vite + estructura

**Files:**
- Create: `Tema2/Async_Odyssey/package.json`
- Create: `Tema2/Async_Odyssey/.gitignore`
- Create: `Tema2/Async_Odyssey/index.html`
- Create: `Tema2/Async_Odyssey/src/` (carpeta, vacía hasta la Tarea 2)

**Interfaces:**
- Produces: proyecto que arranca con `npm run dev`; `index.html` con los ids `#formulario`, `#ingrediente`, `#resultado` que usarán `render.js` y `main.js`; carga `/src/main.js` como módulo.

- [ ] **Step 1: Crear la carpeta y el `package.json`**

```bash
cd /c/UNI/Tercero/WEB1
mkdir -p Tema2/Async_Odyssey/src
```

Crear `Tema2/Async_Odyssey/package.json`:

```json
{
  "name": "async-odyssey",
  "private": true,
  "version": "1.0.0",
  "description": "Nevera vacía: buscador de recetas con TheMealDB (Misión M2, Web Development I)",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 2: Instalar Vite como devDependency**

Run: `cd /c/UNI/Tercero/WEB1/Tema2/Async_Odyssey && npm install --save-dev vite`
Expected: se crea `node_modules/` y `package-lock.json`, y `package.json` gana un bloque `devDependencies` con `vite`.

- [ ] **Step 3: Crear `.gitignore`**

```
node_modules/
dist/
```

- [ ] **Step 4: Crear `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nevera vacía</title>
  </head>
  <body>
    <main>
      <header>
        <h1>Nevera vacía</h1>
        <p>Dime qué ingrediente te sobra y te digo qué cocinar.</p>
      </header>

      <form id="formulario">
        <label for="ingrediente">Ingrediente (en inglés)</label>
        <input id="ingrediente" type="text" placeholder="chicken" autocomplete="off" />
        <button type="submit">Buscar</button>
      </form>

      <section id="resultado" aria-live="polite">
        <p class="estado">Escribe un ingrediente para empezar.</p>
      </section>
    </main>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **Step 5: Verificar que Vite arranca**

Run: `cd /c/UNI/Tercero/WEB1/Tema2/Async_Odyssey && timeout 8 npx vite --port 5173 || true`
Expected: imprime `VITE vX ready` y `Local: http://localhost:5173/` (la consola avisará de que `/src/main.js` no existe todavía; es normal en esta tarea).

- [ ] **Step 6: Verificar que git ignora `node_modules`**

Run: `cd /c/UNI/Tercero/WEB1 && git status --short Tema2`
Expected: aparecen `package.json`, `package-lock.json`, `.gitignore` e `index.html`; **no** aparece `node_modules/`.

- [ ] **Step 7: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/package.json Tema2/Async_Odyssey/package-lock.json Tema2/Async_Odyssey/.gitignore Tema2/Async_Odyssey/index.html
git commit -m "$(cat <<'EOF'
Fase 1: proyecto Vite vanilla con index.html y .gitignore

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: `api.js` (fetch y errores)

**Files:**
- Create: `Tema2/Async_Odyssey/src/api.js`

**Interfaces:**
- Produces (todas `async`):
  - `buscarPorIngrediente(ingrediente: string): Promise<Array<{ idMeal, strMeal, strMealThumb }>>` — `[]` si la API devuelve `meals: null`. Convierte espacios en `_` y codifica la URL.
  - `obtenerReceta(id: string): Promise<object | null>` — objeto crudo de TheMealDB, o `null` si no existe.
  - Lanzan `Error` si `respuesta.ok` es falso o hay fallo de red. No tocan el DOM.

- [ ] **Step 1: Escribir `src/api.js`**

```js
const BASE = "https://www.themealdb.com/api/json/v1/1";

async function pedir(url) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }
  return respuesta.json();
}

export async function buscarPorIngrediente(ingrediente) {
  const clave = encodeURIComponent(ingrediente.trim().replace(/\s+/g, "_"));
  const datos = await pedir(`${BASE}/filter.php?i=${clave}`);
  return datos.meals ?? [];
}

export async function obtenerReceta(id) {
  const datos = await pedir(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  return datos.meals?.[0] ?? null;
}
```

- [ ] **Step 2: Comprobar búsqueda real con resultados**

Run (desde `Tema2/Async_Odyssey`):
```bash
node --input-type=module -e "import { buscarPorIngrediente } from './src/api.js'; const r = await buscarPorIngrediente('chicken'); console.log(r.length > 0, Object.keys(r[0]));"
```
Expected: `true [ 'strMeal', 'strMealThumb', 'idMeal' ]` (el orden de las claves puede variar).

- [ ] **Step 3: Comprobar el caso «sin resultados» y el de varias palabras**

Run:
```bash
node --input-type=module -e "import { buscarPorIngrediente } from './src/api.js'; console.log((await buscarPorIngrediente('zzzzzz')).length); console.log((await buscarPorIngrediente('chicken breast')).length > 0);"
```
Expected: `0` y `true`.

- [ ] **Step 4: Comprobar detalle e id inexistente**

Run:
```bash
node --input-type=module -e "import { obtenerReceta } from './src/api.js'; const r = await obtenerReceta('52772'); console.log(r.strMeal); console.log(await obtenerReceta('0'));"
```
Expected: `Teriyaki Chicken Casserole` y `null`.

- [ ] **Step 5: Comprobar que un fallo de red lanza excepción**

Run (sin red simulada: se apunta a un puerto cerrado reemplazando `fetch`):
```bash
node --input-type=module -e "globalThis.fetch = async () => { throw new TypeError('fetch failed'); }; import('./src/api.js').then(async (m) => { try { await m.buscarPorIngrediente('egg'); console.log('NO LANZO'); } catch (e) { console.log('lanza:', e.message); } });"
```
Expected: `lanza: fetch failed`.

- [ ] **Step 6: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/src/api.js
git commit -m "$(cat <<'EOF'
Fase 2: api.js con fetch, async/await y comprobacion de response.ok

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `logic.js` (transformaciones)

**Files:**
- Create: `Tema2/Async_Odyssey/src/logic.js`

**Interfaces:**
- Consumes: el formato crudo de TheMealDB (`idMeal`, `strMeal`, `strMealThumb`, `strIngredient1..20`, `strMeasure1..20`, `strInstructions`, `strCategory`, `strArea`).
- Produces (funciones puras, sin DOM ni red):
  - `normalizarLista(crudas: object[]): Array<{ id, nombre, imagen }>`
  - `agruparPorLetra(recetas: Array<{ id, nombre, imagen }>): { [letra: string]: Array<{ id, nombre, imagen }> }`
  - `normalizarReceta(cruda: object): { id, nombre, imagen, categoria, area, ingredientes: Array<{ ingrediente, medida }>, pasos: string[] }`

- [ ] **Step 1: Escribir `src/logic.js`**

```js
export const normalizarLista = (crudas) =>
  crudas.map(({ idMeal, strMeal, strMealThumb }) => ({
    id: idMeal,
    nombre: strMeal,
    imagen: strMealThumb,
  }));

export const agruparPorLetra = (recetas) =>
  recetas.reduce((grupos, receta) => {
    const letra = (receta.nombre?.trim()[0] ?? "#").toUpperCase();
    (grupos[letra] ??= []).push(receta);
    return grupos;
  }, {});

export const normalizarReceta = (cruda) => {
  const ingredientes = Object.keys(cruda)
    .filter((clave) => clave.startsWith("strIngredient") && cruda[clave]?.trim())
    .map((clave) => ({
      ingrediente: cruda[clave].trim(),
      medida: (cruda[clave.replace("Ingredient", "Measure")] ?? "").trim(),
    }));

  const pasos = (cruda.strInstructions ?? "")
    .split(/\r?\n/)
    .map((paso) => paso.trim())
    .filter(Boolean);

  return {
    id: cruda.idMeal,
    nombre: cruda.strMeal,
    imagen: cruda.strMealThumb,
    categoria: cruda.strCategory,
    area: cruda.strArea,
    ingredientes,
    pasos,
  };
};
```

- [ ] **Step 2: Comprobar `normalizarLista` y `agruparPorLetra` (incluye nombre vacío)**

Run (desde `Tema2/Async_Odyssey`):
```bash
node --input-type=module -e "
import { normalizarLista, agruparPorLetra } from './src/logic.js';
const lista = normalizarLista([
  { idMeal: '1', strMeal: 'Apple pie', strMealThumb: 'a.jpg' },
  { idMeal: '2', strMeal: 'arepa', strMealThumb: 'b.jpg' },
  { idMeal: '3', strMeal: 'Burek', strMealThumb: 'c.jpg' },
  { idMeal: '4', strMeal: '', strMealThumb: 'd.jpg' },
  { idMeal: '5', strMealThumb: 'e.jpg' },
]);
const g = agruparPorLetra(lista);
console.log(Object.keys(g).join(','), g.A.length, g['#'].length);
"
```
Expected: `A,B,#` `2` `2` (el orden de claves puede variar, pero `A` tiene 2 y `#` tiene 2).

- [ ] **Step 3: Comprobar `normalizarReceta` con datos raros**

Run:
```bash
node --input-type=module -e "
import { normalizarReceta } from './src/logic.js';
const r = normalizarReceta({
  idMeal: '9', strMeal: 'Test', strMealThumb: 't.jpg', strCategory: 'Beef', strArea: 'Spanish',
  strIngredient1: 'Egg', strMeasure1: '2 ',
  strIngredient2: 'Salt', strMeasure2: null,
  strIngredient3: '', strMeasure3: ' ',
  strIngredient4: null, strMeasure4: null,
  strIngredient5: '   ', strMeasure5: '1',
  strInstructions: 'Paso uno.\r\n\r\nPaso dos.\r\n   \r\n',
});
console.log(JSON.stringify(r.ingredientes));
console.log(JSON.stringify(r.pasos));
console.log(normalizarReceta({ idMeal: '1', strInstructions: null }).pasos.length);
"
```
Expected:
```
[{"ingrediente":"Egg","medida":"2"},{"ingrediente":"Salt","medida":""}]
["Paso uno.","Paso dos."]
0
```

- [ ] **Step 4: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/src/logic.js
git commit -m "$(cat <<'EOF'
Fase 3: logic.js con map, filter y reduce para transformar los datos

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: `render.js` + `main.js` (estados y flujo completo)

**Files:**
- Create: `Tema2/Async_Odyssey/src/render.js`
- Create: `Tema2/Async_Odyssey/src/main.js`

**Interfaces:**
- Consumes: `buscarPorIngrediente`, `obtenerReceta` (Tarea 2); `normalizarLista`, `agruparPorLetra`, `normalizarReceta` (Tarea 3); ids `#formulario`, `#ingrediente`, `#resultado` de `index.html` (Tarea 1).
- Produces en `render.js` (solo DOM): `pintarCargando()`, `pintarError(mensaje: string)`, `pintarVacio(texto: string)`, `pintarGrupos(grupos)`, `pintarDetalle(receta)`.
  - Las tarjetas son `<button class="tarjeta" data-id="...">`; el botón de vuelta es `<button class="volver">`. `main.js` los usa con delegación de eventos.

- [ ] **Step 1: Escribir `src/render.js`**

```js
const zona = document.querySelector("#resultado");

function crear(etiqueta, texto, clase) {
  const elemento = document.createElement(etiqueta);
  if (texto) elemento.textContent = texto;
  if (clase) elemento.className = clase;
  return elemento;
}

function mostrar(...nodos) {
  zona.replaceChildren(...nodos);
}

export const pintarCargando = () => mostrar(crear("p", "Cargando…", "estado"));

export const pintarVacio = (texto) => mostrar(crear("p", texto, "estado"));

export function pintarError(mensaje) {
  const aviso = crear("p", mensaje, "estado estado--error");
  aviso.setAttribute("role", "alert");
  mostrar(aviso);
}

function crearTarjeta({ id, nombre, imagen }) {
  const tarjeta = crear("button", "", "tarjeta");
  tarjeta.type = "button";
  tarjeta.dataset.id = id;

  const foto = document.createElement("img");
  foto.src = imagen;
  foto.alt = "";
  foto.loading = "lazy";

  tarjeta.append(foto, crear("span", nombre));
  return tarjeta;
}

export function pintarGrupos(grupos) {
  const secciones = Object.entries(grupos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letra, recetas]) => {
      const seccion = crear("section", "", "grupo");
      const rejilla = crear("div", "", "rejilla");
      rejilla.append(...recetas.map(crearTarjeta));
      seccion.append(crear("h2", letra), rejilla);
      return seccion;
    });
  mostrar(...secciones);
}

export function pintarDetalle(receta) {
  const ficha = crear("article", "", "ficha");

  const volver = crear("button", "← Volver a la lista", "volver");
  volver.type = "button";

  const foto = document.createElement("img");
  foto.src = receta.imagen;
  foto.alt = receta.nombre;

  const ingredientes = crear("ul", "", "ingredientes");
  ingredientes.append(
    ...receta.ingredientes.map(({ ingrediente, medida }) =>
      crear("li", `${medida} ${ingrediente}`.trim()),
    ),
  );

  const pasos = crear("ol", "", "pasos");
  pasos.append(...receta.pasos.map((paso) => crear("li", paso)));

  ficha.append(
    volver,
    foto,
    crear("h2", receta.nombre),
    crear("p", [receta.categoria, receta.area].filter(Boolean).join(" · "), "meta"),
    crear("h3", "Ingredientes"),
    ingredientes,
    crear("h3", "Preparación"),
    pasos,
  );
  mostrar(ficha);
}
```

- [ ] **Step 2: Escribir `src/main.js`**

```js
import { buscarPorIngrediente, obtenerReceta } from "./api.js";
import { normalizarLista, agruparPorLetra, normalizarReceta } from "./logic.js";
import {
  pintarCargando,
  pintarError,
  pintarVacio,
  pintarGrupos,
  pintarDetalle,
} from "./render.js";

const formulario = document.querySelector("#formulario");
const entrada = document.querySelector("#ingrediente");
const resultado = document.querySelector("#resultado");

let ultimosGrupos = null;

async function buscar(ingrediente) {
  pintarCargando();
  try {
    const recetas = normalizarLista(await buscarPorIngrediente(ingrediente));
    if (recetas.length === 0) {
      ultimosGrupos = null;
      pintarVacio(`No hay recetas con «${ingrediente}». Prueba en inglés: chicken, egg, rice…`);
      return;
    }
    ultimosGrupos = agruparPorLetra(recetas);
    pintarGrupos(ultimosGrupos);
  } catch (error) {
    console.error(error);
    pintarError("No se pudieron cargar las recetas. Revisa tu conexión e inténtalo de nuevo.");
  }
}

async function mostrarDetalle(id) {
  pintarCargando();
  try {
    const cruda = await obtenerReceta(id);
    if (!cruda) {
      pintarVacio("Esa receta ya no existe.");
      return;
    }
    pintarDetalle(normalizarReceta(cruda));
  } catch (error) {
    console.error(error);
    pintarError("No se pudo cargar la receta. Revisa tu conexión e inténtalo de nuevo.");
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const ingrediente = entrada.value.trim();
  if (!ingrediente) {
    pintarVacio("Escribe un ingrediente para empezar.");
    return;
  }
  buscar(ingrediente);
});

resultado.addEventListener("click", (evento) => {
  const tarjeta = evento.target.closest(".tarjeta");
  if (tarjeta) {
    mostrarDetalle(tarjeta.dataset.id);
    return;
  }
  if (evento.target.closest(".volver") && ultimosGrupos) {
    pintarGrupos(ultimosGrupos);
  }
});
```

- [ ] **Step 3: Arrancar el servidor**

Run (en segundo plano): `cd /c/UNI/Tercero/WEB1/Tema2/Async_Odyssey && npm run dev`
Expected: `Local: http://localhost:5173/`. Abrir esa URL en el navegador.

- [ ] **Step 4: Verificar en el navegador (sin estilos todavía, es normal que se vea feo)**

Comprobar, mirando la consola del navegador (sin errores rojos) y la pantalla:
1. Buscar `chicken` → aparece «Cargando…» un instante y luego secciones por letra con tarjetas.
2. Buscar `zzzzzz` → «No hay recetas con «zzzzzz»…».
3. Enviar el campo vacío → «Escribe un ingrediente para empezar.».
4. Pulsar una tarjeta → ficha con ingredientes (sin filas vacías) y pasos; «Volver a la lista» devuelve la lista anterior.
5. DevTools → Network → «Offline», buscar `egg` → mensaje rojo de error (no se queda en «Cargando…»).

- [ ] **Step 5: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/src/render.js Tema2/Async_Odyssey/src/main.js
git commit -m "$(cat <<'EOF'
Fase 4: render.js y main.js con estados de carga, error y vacio

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Estilos «cocina»

**Files:**
- Create: `Tema2/Async_Odyssey/src/style.css`
- Modify: `Tema2/Async_Odyssey/src/main.js` (primera línea: importar el CSS)

**Interfaces:**
- Consumes: clases creadas por `render.js` (`estado`, `estado--error`, `grupo`, `rejilla`, `tarjeta`, `ficha`, `volver`, `ingredientes`, `pasos`, `meta`) y los elementos de `index.html`.

- [ ] **Step 1: Escribir `src/style.css`**

```css
:root {
  --crema: #fbf5e9;
  --papel: #fffdf7;
  --tinta: #3b2f2a;
  --terracota: #c4622d;
  --oliva: #6b7a3a;
  --borde: #e6d9bf;
  --error: #a3261f;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--crema);
  color: var(--tinta);
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.5;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

header {
  text-align: center;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 2.6rem;
  color: var(--terracota);
}

header p {
  margin: 0.25rem 0 0;
  font-style: italic;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

input {
  padding: 0.6rem 0.8rem;
  border: 2px solid var(--borde);
  border-radius: 8px;
  background: var(--papel);
  font: inherit;
}

button {
  font: inherit;
  cursor: pointer;
}

form button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: var(--oliva);
  color: white;
}

.estado {
  text-align: center;
  font-style: italic;
}

.estado--error {
  color: var(--error);
  font-weight: bold;
}

.grupo h2 {
  border-bottom: 2px dashed var(--borde);
  color: var(--oliva);
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tarjeta {
  padding: 0.5rem;
  border: 1px solid var(--borde);
  border-radius: 10px;
  background: var(--papel);
  color: inherit;
  text-align: center;
}

.tarjeta:hover {
  border-color: var(--terracota);
}

.tarjeta img {
  width: 100%;
  border-radius: 6px;
}

.ficha {
  padding: 1.5rem;
  border: 1px solid var(--borde);
  border-radius: 12px;
  background: var(--papel);
}

.ficha img {
  width: 100%;
  max-width: 320px;
  border-radius: 10px;
}

.ficha h3 {
  color: var(--terracota);
}

.meta {
  color: var(--oliva);
  font-style: italic;
}

.volver {
  margin-bottom: 1rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--borde);
  border-radius: 8px;
  background: transparent;
  color: var(--tinta);
}
```

- [ ] **Step 2: Importar el CSS en `src/main.js`**

Añadir como **primera línea** de `src/main.js`:

```js
import "./style.css";
```

- [ ] **Step 3: Verificar en el navegador**

Con `npm run dev` activo, recargar. Comprobar: fondo crema, título terracota, tarjetas en rejilla, ficha de receta legible, y que se ve bien con el navegador estrecho (ancho de móvil, sin scroll horizontal).

- [ ] **Step 4: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/src/style.css Tema2/Async_Odyssey/src/main.js
git commit -m "$(cat <<'EOF'
Fase 5: estilos de cocina (crema, terracota y oliva)

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Caché en `localStorage` (bonus)

**Files:**
- Modify: `Tema2/Async_Odyssey/src/api.js` (solo `pedir` y funciones de caché nuevas)

**Interfaces:**
- Consumes/Produces: `pedir(url)` mantiene su firma `async (url: string) => object`; `buscarPorIngrediente` y `obtenerReceta` no cambian. La caché es transparente para el resto de módulos.

- [ ] **Step 1: Sustituir `pedir` y añadir las funciones de caché en `src/api.js`**

Reemplazar la función `pedir` actual por este bloque (el resto del archivo no cambia):

```js
const PREFIJO = "nevera:";

function leerCache(url) {
  try {
    const guardado = localStorage.getItem(PREFIJO + url);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

function guardarCache(url, datos) {
  try {
    localStorage.setItem(PREFIJO + url, JSON.stringify(datos));
  } catch {
    // sin espacio o localStorage bloqueado: la app sigue funcionando sin caché
  }
}

async function pedir(url) {
  const enCache = leerCache(url);
  if (enCache) return enCache;

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con el código ${respuesta.status}`);
  }
  const datos = await respuesta.json();
  guardarCache(url, datos);
  return datos;
}
```

- [ ] **Step 2: Verificar la caché en el navegador**

Con `npm run dev` activo y DevTools → Network abierto:
1. Buscar `chicken` → aparece 1 petición a `filter.php?i=chicken`.
2. Buscar `chicken` otra vez → **no** aparece petición nueva.
3. DevTools → Application → Local Storage: existe la clave `nevera:https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken`.

- [ ] **Step 3: Verificar caché corrupta**

En la consola del navegador:
```js
localStorage.setItem("nevera:https://www.themealdb.com/api/json/v1/1/filter.php?i=egg", "{no es json");
```
Buscar `egg` → la app muestra recetas (ignora la caché rota y pide a la red), sin errores en consola.

- [ ] **Step 4: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/src/api.js
git commit -m "$(cat <<'EOF'
Fase 6: cache en localStorage para no repetir peticiones

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: README con «Uso de IA» y verificación final

**Files:**
- Create: `Tema2/Async_Odyssey/README.md`
- Modify: `README.md` (raíz, índice de carpetas) — añadir la fila de Tema 2

**Interfaces:**
- Consumes: el comportamiento final de todas las tareas anteriores.

> **Importante:** la sección «Uso de IA» es una declaración **personal** que se evalúa y se defiende de forma oral. El agente redacta lo factual (qué se pidió y qué se generó); las partes marcadas «escribe con tus palabras» las **completa Pablo** antes del commit. No se commitea con esas marcas dentro.

- [ ] **Step 1: Escribir `Tema2/Async_Odyssey/README.md`**

```markdown
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
| `src/api.js` | Solo red: `fetch`, `async/await`, `try/catch` desde quien llama, `response.ok` y caché en `localStorage`. |
| `src/logic.js` | Solo datos: `map`, `filter` y `reduce`. No toca el DOM ni la red. |
| `src/render.js` | Solo DOM: pinta cargando, error, vacío, la lista y el detalle con `createElement` y `textContent`. |
| `src/main.js` | Conecta todo: eventos del formulario y de la lista → API → lógica → render. |
| `src/style.css` | Tema «cocina». |

## Dónde se usa cada método de array

- `map` en `normalizarLista`: de los campos de la API (`strMeal`, `strMealThumb`) a `{ id, nombre, imagen }`.
- `filter` + `map` en `normalizarReceta`: la API da 20 campos `strIngredient1…20` y muchos vienen vacíos; se descartan los vacíos y se emparejan con su medida.
- `reduce` en `agruparPorLetra`: convierte la lista de recetas en un objeto `{ A: [...], B: [...] }`.

## Estados y errores

- **Cargando:** se pinta antes de cada petición.
- **Error:** `api.js` lanza un `Error` si falla la red o `respuesta.ok` es falso; `main.js` lo captura con `try/catch` y muestra un mensaje al usuario.
- **Vacío:** la API devuelve `meals: null` cuando no hay resultados; `api.js` lo convierte en `[]` y la app muestra «No hay recetas…». También se avisa si el campo está vacío.
- **Datos raros:** ingredientes `null` o con espacios se descartan; si no hay instrucciones, la lista de pasos queda vacía.

## Caché (bonus)

`api.js` guarda cada respuesta en `localStorage` con la URL como clave. Si la URL ya está guardada, no se repite el `fetch`. Si la caché está corrupta o `localStorage` no está disponible, se ignora y se pide a la red.

## Uso de IA

Usé Claude Code como pareja de programación para plantear, diseñar e implementar la misión.

**Qué pedí:** (escribe con tus palabras los prompts reales que mandaste: p. ej. pasar el enunciado, elegir la API, pedir que fuese lo más corta y fácil de explicar posible, pedir un tema «cocina»).

**Qué cambié o decidí yo:** (escribe con tus palabras: elegir TheMealDB, descartar agrupar por categoría porque exigía muchas peticiones, usar Vite vanilla en vez de React, dejar `mi-app` aparte…).

**Qué entiendo:** (escribe con tus palabras cómo funciona el flujo `submit → api → logic → render` y por qué cada módulo hace solo una cosa).

**Cómo lo verifiqué:** probé a mano búsquedas con resultados, sin resultados y con el campo vacío; el modo offline de DevTools para el estado de error; un detalle de receta con ingredientes vacíos; y la pestaña Network para comprobar que una segunda búsqueda igual no repite la petición.

## Autopsia

(escribe con tus palabras 1-2 decisiones técnicas y qué alternativas descartaste. Ideas: `reduce` para agrupar en vez de un `for`; la lógica sin DOM para poder comprobarla por separado; la delegación de eventos en `#resultado`; convertir `meals: null` en `[]` dentro de `api.js`.)
```

- [ ] **Step 2: Pablo completa los tres apartados marcados**

Reemplazar cada texto entre paréntesis por su propia redacción. Antes de seguir, comprobar que no queda ningún paréntesis con «escribe con tus palabras»:

Run: `cd /c/UNI/Tercero/WEB1 && grep -n "escribe con tus palabras" Tema2/Async_Odyssey/README.md`
Expected: sin resultados.

- [ ] **Step 3: Añadir Tema 2 al README raíz**

En `README.md` (raíz), en la tabla del índice, añadir tras la última fila:

```markdown
| Tema 2 | **Nevera vacía** — Misión M2 · Async Odyssey | [`Tema2/Async_Odyssey/`](Tema2/Async_Odyssey/) | Buscador de recetas por ingrediente con TheMealDB: `fetch` + `async/await`, módulos ES, `map/filter/reduce`, estados de carga/error/vacío y caché en `localStorage`. App Vite en JS puro. | [README de la misión](Tema2/Async_Odyssey/README.md) |
```

Y corregir la frase de la cabecera que dice que todos los proyectos usan solo HTML, CSS y JS sin herramientas: añadir «(el Tema 2 usa Vite como servidor de desarrollo)».

- [ ] **Step 4: Verificación final de build y repo limpio**

Run:
```bash
cd /c/UNI/Tercero/WEB1/Tema2/Async_Odyssey && npm run build
cd /c/UNI/Tercero/WEB1 && git status --short && git ls-files Tema2 | grep -E "node_modules|dist/" ; echo "salida grep: $?"
```
Expected: el build termina sin errores; `git status` solo lista `README.md` raíz y `Tema2/Async_Odyssey/README.md` como cambios pendientes (más lo que ya estuviera sin trackear antes: `mi-app/` y el `M` de `Tema1`, que no se tocan); el `grep` no encuentra nada (`salida grep: 1`).

- [ ] **Step 5: Revisar los checks automáticos de la rúbrica**

Run:
```bash
cd /c/UNI/Tercero/WEB1 && git log --oneline | head -12 && grep -n '"vite"' Tema2/Async_Odyssey/package.json && ls Tema2/Async_Odyssey Tema2/Async_Odyssey/src
```
Expected: ≥ 5 commits de las fases de Tema 2 visibles; `vite` aparece en `package.json`; existen `README.md`, `.gitignore`, `index.html` y los cuatro `.js` de `src/`.

- [ ] **Step 6: Commit**

```bash
cd /c/UNI/Tercero/WEB1
git add Tema2/Async_Odyssey/README.md README.md
git commit -m "$(cat <<'EOF'
Fase 7: README con uso de IA y autopsia, e indice del repo actualizado

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 7: Subir a GitHub (solo con permiso explícito de Pablo)**

La entrega es una URL de GitHub. Antes de ejecutar `git push`, preguntar a Pablo: el push publica el repo. Comprobar con `git remote -v` que el remoto es el esperado.

---

## Self-Review

**Cobertura del spec:** estructura y carpeta (Tarea 1); `api.js` con `response.ok`, `meals: null` y espacios→`_` (2); `normalizarLista`/`agruparPorLetra`/`normalizarReceta` (3); `render.js` y `main.js` con estados cargando/error/vacío, entrada vacía y delegación (4); estilo «cocina» (5); caché + caché corrupta (6); README con «Uso de IA», autopsia, `.gitignore`, ≥ 5 commits (1, 7); verificación final de build y repo limpio (7). `mi-app/` no se toca en ninguna tarea.

**Placeholders:** el código está completo en todos los pasos. Las únicas marcas pendientes son las de la declaración personal de IA del README (Tarea 7), que se dejan a propósito para que Pablo las escriba, con un paso que comprueba que desaparecen antes del commit.

**Consistencia de nombres:** `buscarPorIngrediente`, `obtenerReceta`, `normalizarLista`, `agruparPorLetra`, `normalizarReceta`, `pintarCargando/Error/Vacio/Grupos/Detalle`, clases `.tarjeta` y `.volver`, y ids `#formulario`, `#ingrediente`, `#resultado` coinciden entre tareas.

**Review Focus:** los cinco casos tienen su comprobación: nombre vacío (T3 paso 2), varias palabras (T2 paso 3), instrucciones nulas o con `\r\n` (T3 paso 3), caché corrupta (T6 paso 3), id inexistente (T2 paso 4 y T4 `pintarVacio`).
