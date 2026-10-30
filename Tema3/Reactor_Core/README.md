# Nevera vacía · React

Misión M3 · Reactor Core — Web Development I.

La «Nevera vacía» de la M2, rehecha en **React 19 con Vite** y con una idea nueva: ya no buscas por un ingrediente, sino que **llenas tu nevera** con hasta 5 ingredientes y la app te enseña qué puedes cocinar, **primero las recetas que aprovechan más cosas de las que tienes**. Al abrir una receta ves qué ingredientes ya tienes y puedes **copiar la lista de la compra** con lo que te falta. Las recetas que te gustan se guardan en **favoritos**. La nevera y los favoritos sobreviven a recargar la página.

Datos de [TheMealDB](https://www.themealdb.com/api.php) (API pública, sin clave). Los nombres de los ingredientes van en inglés.

## Cómo probarlo

```bash
cd Tema3/Reactor_Core
npm install
npm run dev
```

Abre la URL que imprime Vite (normalmente `http://localhost:5173`).

- Pulsa `Chicken` en «prueba con» y añade `Rice`: arriba salen las recetas que usan los dos.
- Abre una receta: los ingredientes que tienes salen marcados «en tu nevera» y el botón copia lo que falta.
- `zzzz` enseña el estado vacío; modo offline en DevTools (Network → Offline) enseña el de error con «Reintentar».
- `npm run lint` pasa el linter (oxlint con las reglas de hooks) sin avisos.

## Componentes

```
App                      estado compartido: nevera, favoritos, vista y receta abierta
├── Buscador             input controlado + sugerencias (datalist) + validación
├── Nevera               etiquetas de ingredientes, quitar, vaciar y ejemplos
├── Pestanas             Recetas / Favoritos (n)
├── Resultados           pide las recetas y las agrupa por coincidencias
│   └── RejillaRecetas
│       └── TarjetaReceta
│           └── BotonFavorito
├── Favoritos            recetas guardadas (sin pedir nada a la API)
│   └── RejillaRecetas   (el mismo componente, reutilizado)
├── Detalle              <dialog> modal: pide una receta y gestiona sus estados
│   └── FichaReceta
│       ├── BotonFavorito (reutilizado, con texto)
│       └── ListaIngredientes   «en tu nevera» + lista de la compra
└── Estado               mensaje de cargando / error / vacío (lo usan Resultados, Favoritos y Detalle)
```

Ningún fichero de JavaScript pasa de 90 líneas. Los componentes solo pintan y avisan al padre con callbacks (`onAnadir`, `onQuitar`, `onAbrir`, `onAlternarFavorito`, `onCerrar`); la red y los cálculos viven fuera de React:

| Carpeta | Qué hay | Responsabilidad |
|---|---|---|
| `src/api/` | `mealdb.js`, `cache.js` | Solo red: URLs, `fetch`, `response.ok`, errores con nombre (`ErrorHttp`, `ErrorDatos`) y caché con caducidad. |
| `src/logic/` | `recetas.js` | Funciones puras (`map`, `filter`, `reduce`, `Object.groupBy`): combinar resultados, agrupar, normalizar, validar. |
| `src/hooks/` | `useFetch.js`, `useLocalStorage.js` | Los dos custom hooks (bonus). |
| `src/components/` | 12 componentes | Solo UI. |
| `src/styles/` | 4 hojas | Base, nevera, recetas y detalle. |

## Estado: mínimo y derivado

Solo hay **cuatro** estados en `App` y dos pequeños dentro de componentes:

| Estado | Dónde | Por qué ahí |
|---|---|---|
| `nevera` (array de ingredientes) | `App`, con `useLocalStorage` | lo usan `Buscador`, `Nevera`, `Resultados` y `Detalle` → se levanta al padre común |
| `favoritos` (array `{ id, nombre, imagen }`) | `App`, con `useLocalStorage` | lo usan las tarjetas, el detalle y las pestañas |
| `vista` (`"recetas"` / `"favoritos"`) | `App` | decide qué se pinta debajo de las pestañas |
| `recetaAbierta` (id o `null`) | `App` | abre y cierra el `Detalle` |
| `texto`, `aviso` | `Buscador` | solo le importan al formulario |
| `copia` | `ListaIngredientes` | mensaje de «copiado» |

Todo lo demás **se calcula en el render**, nunca se guarda: `idsFavoritos` (un `Set` a partir de `favoritos`), la lista combinada y agrupada de recetas, los ingredientes que faltan, «tienes X de Y», el contador de favoritos y hasta `cargando` dentro de `useFetch`.

Todas las actualizaciones son inmutables: `[...actual, x]`, `filter`, `map` y `toSorted`; nunca `push`, `splice` ni `sort` sobre el estado. Las que dependen del valor anterior usan la función actualizadora (`setNevera((actual) => …)`).

## Efectos: solo los necesarios y con limpieza

Hay **cuatro** `useEffect` en toda la app, y todos sincronizan con algo de fuera de React:

| Efecto | Sistema externo | Dependencias | Limpieza |
|---|---|---|---|
| `useFetch` | la API (red) | `[clave, intento]` | `controlador.abort()`: cancela la petición vieja si cambian las URLs o se desmonta, y además se ignora su respuesta (`signal.aborted`), así nunca pisa a la nueva |
| `useLocalStorage` (guardar) | `localStorage` | `[clave, valor]` | no hace falta: `setItem` es instantáneo y no deja nada abierto |
| `useLocalStorage` (escuchar) | evento `storage` de otras pestañas | `[clave]` | `removeEventListener` |
| `Detalle` | `dialog.showModal()` (API del DOM) | `[]` | no hace falta: al cerrar, el `<dialog>` se desmonta |

Lo que **no** es un efecto: filtrar o agrupar recetas (se calcula en el render), añadir un ingrediente o copiar la lista (va en el manejador del evento).

`useFetch` depende de `urls.join(" ")` y no del array: así un array nuevo en cada render con las mismas URLs no repite la petición, y el linter no avisa de dependencias.

## Listas, keys y condicionales

- Recetas: `key={receta.id}` (id de TheMealDB), estable aunque la lista se reordene al añadir ingredientes.
- Ingredientes de la nevera: `key={normalizar(ingrediente)}`, único porque `validarIngrediente` no deja repetir.
- Grupos: `key={cantidad}`; ingredientes de una receta: `key={posicion}` (su número 1-20 en la API); pasos: `key={numero}`.
- Ningún `key={index}`.
- Condicionales: `if` con `return` temprano para los estados de `Resultados`, `Nevera`, `Favoritos` y `ListaIngredientes`; ternario solo para elegir entre dos cosas; `&&` siempre con una condición booleana (`length > 0`), nunca con un número suelto.

## Custom hooks (bonus)

- **`useFetch(urls)`**: pide varias URLs en paralelo (`Promise.all`) y devuelve `{ datos, error, cargando, reintentar }`. Lo usan `Resultados` (una URL por ingrediente), `Detalle` (una receta) y `Buscador` (la lista de ingredientes para las sugerencias).
- **`useLocalStorage(clave, inicial)`**: como `useState`, pero guarda en `localStorage`, aguanta JSON corrupto o `localStorage` bloqueado, comprueba que el tipo guardado coincide y se sincroniza entre pestañas. Lo usan la nevera y los favoritos.

## Qué arreglé de la corrección de la M2

| La Arena dijo en la M2 | Cómo está ahora |
|---|---|
| Carrera entre dos búsquedas seguidas | `AbortController` en la limpieza de `useFetch` + ignorar respuestas de peticiones canceladas |
| Mismo mensaje para error de red y HTTP | `ErrorHttp` (con el código), `ErrorDatos` y `TypeError` de red tienen cada uno su texto (`mensajeDeError`) |
| No se valida la forma de los datos | si la respuesta no trae `meals`, se lanza `ErrorDatos` |
| La caché nunca caduca y vive en `api.js` | `cache.js` propio, con fecha y caducidad de un día |
| `render.js` acoplado a `#resultado` | ya no hay selectores: cada componente recibe lo que necesita por props |
| Depende del orden de las claves `strIngredientN` | se recorren por número del 1 al 20 |
| Foco al volver del detalle | el `<dialog>` nativo devuelve el foco a la tarjeta al cerrarse |
| Originalidad: «combinar ingredientes o favoritos» | las dos cosas, más la lista de la compra |

## Accesibilidad y detalles

Etiqueta en el input, `aria-invalid` y aviso con `role="status"`; errores con `role="alert"`; botones de icono con `aria-label`; `aria-pressed` en pestañas y favoritos; foco visible; objetivos táctiles de 44&nbsp;px; `prefers-reduced-motion`; sin scroll horizontal a 375&nbsp;px.

## Uso de IA

Usé **Claude Code** (Claude Opus) como pareja de programación para toda la misión, igual que en la M2.

**Qué pedí.** Le pedí que leyera mis notas del curso (enunciado y rúbrica de la M3, la corrección de la M2 y el PDF de la unidad 3) y que siguiera con la nevera en React. El prompt real fue:

> «Entra en el brain y mira todo lo que hay que hacer de la misión 3 de web. La idea es continuar la nevera pero para React, pero léete todos los PDF y todo lo que hay para tenerlo claro, aparte de intentar sacar la máxima nota posible con lo más sencillo posible.»

A partir de ahí la IA propuso el diseño (combinar ingredientes, favoritos y lista de la compra para la originalidad; dos custom hooks para el bonus) y lo implementó por fases, un commit por fase.

**Qué hizo la IA y qué decidí yo.** El código lo generó la IA; no lo escribí a mano. Yo elegí seguir con la nevera en vez del reto del cuaderno, pedí que fuese lo más sencillo posible y que arreglase lo que la Arena me quitó en la M2. Después revisé cada fichero hasta poder explicarlo: dónde vive cada estado, por qué cada efecto tiene esas dependencias y qué hace su limpieza.

**Cómo lo verifiqué.** Con la app abierta en el navegador probamos: añadir `Chicken` y `Rice` (salen primero las que usan los dos), un ingrediente repetido (aviso), `zzzz` (estado vacío), errores simulados de red, HTTP 503 y datos con forma rara (sale el mensaje correcto de cada uno y «Reintentar» recupera), abrir y cerrar el detalle con Escape (el foco vuelve a la tarjeta), guardar un favorito y recargar (sigue ahí), la vista de favoritos, y el ancho de móvil de 375&nbsp;px sin scroll horizontal. `npm run lint` y `npm run build` pasan sin avisos y la consola queda limpia.

## Autopsia

**1. Buscar sola al cambiar la nevera, sin botón «Buscar».** `Resultados` llama a `useFetch(nevera.map(urlPorIngrediente))`, así que cada vez que añades o quitas un ingrediente se lanzan las peticiones otra vez (una por ingrediente). Es discutible porque con 5 ingredientes son 5 peticiones por cambio. Lo dejé así porque la UI reacciona al estado, que es justo lo que pide la misión: la lista que ves siempre corresponde a lo que hay en la nevera. Las peticiones viejas se cancelan con `AbortController` y las repetidas salen de la caché, así que no se desperdicia casi nada. **Descarté** un botón «Buscar» con un estado `buscando` y el botón deshabilitado, porque eran dos estados más y la lista mostrada podía quedar desfasada respecto a la nevera.

**2. `cargando` no es estado: se deduce.** En `useFetch` no hay `useState(cargando)`. Guardo el resultado junto con la clave (las URLs) que lo produjo, y `cargando` es «hay URLs y el resultado guardado no es de estas». **Descarté** lo típico, tres `useState` (`datos`, `error`, `cargando`) con `setCargando(true)` al principio del efecto, porque duplica información (cargando, datos y error pueden contradecirse) y hace un render extra solo para poner el «cargando». Lo malo de mi forma es que hay que pararse a explicarla; por eso tiene comentarios.

**Otras decisiones que defiendo:** `<dialog>` nativo para el detalle en vez de cambiar de vista como en la M2 (Escape, foco atrapado y foco devuelto a la tarjeta sin código mío); props en vez de `useContext` para los favoritos, porque solo bajan dos niveles y así se ve de dónde viene cada dato; y un máximo de 5 ingredientes (`MAX_INGREDIENTES`) para no saturar la API.
