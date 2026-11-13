# Recetario de la Nevera

Misión M4 · Full Contact Forms — Web Development I. «Valida o muere.»

La nevera de la M2 y la M3 ahora tiene comunidad: **publicas tus recetas con un formulario serio** y ves **las de los demás en un listado** que se actualiza solo. El formulario es **no controlado con React Hook Form**, toda la validación vive en **un esquema de Zod** y los datos remotos van con **TanStack Query v5** (queries, mutations e invalidación). La respuesta del API también pasa por Zod: la semilla trae **una receta corrupta a propósito** y la app la atrapa y explica por qué (bonus).

Stack: React 19 + Vite, `react-hook-form` + `@hookform/resolvers` (`zodResolver`), `zod` 4, `@tanstack/react-query` 5, y `json-server` como API REST local. Tests con Vitest y linter oxlint.

## Cómo probarlo

```bash
cd Tema4/Full_Contact_Forms
npm install
cp .env.example .env        # en Windows (cmd): copy .env.example .env
npm run api                 # terminal 1: API en http://localhost:3001
npm run dev                 # terminal 2: app en la URL que imprime Vite
```

`npm run api` crea `api/db.json` copiando `api/semilla.json` (4 recetas buenas y 1 corrupta) la primera vez. Para volver a empezar, borra `api/db.json`.

Qué probar:

- **Publicar vacío**: salen los 9 errores en español, el foco va al primer campo mal y un aviso dice cuántos campos revisar.
- **Vegana con «Leche entera»**: «Lleva leche: no es vegano…» debajo de ese ingrediente. Con «Leche de avena» pasa.
- **Dificultad «fácil» con 60 minutos**: el error sale en los minutos; al cambiar a «media» desaparece solo.
- **Dos veces «Tomate»** (o «tomate» y «TOMATE»): el segundo dice que ya está en la lista.
- **Publicar bien**: el botón pasa a «Publicando…», sale «“…” ya está publicada», el formulario se vacía y la receta aparece arriba del listado sin recargar.
- **Ctrl + Enter** en «Cómo se hace» publica.
- **Borrar** una receta: «Borrando…» solo en esa tarjeta y el listado se refresca.
- **Filtros** por categoría: cada uno se pide una vez y volver a uno ya visto es instantáneo.
- **Apaga la API** (Ctrl+C en la terminal 1) y recarga: estado de error con «Reintentar». Intenta publicar: error claro y los datos siguen en el formulario.
- **Bonus**: arriba del listado, «1 receta del servidor llegó corrupta: Zod la ha descartado»; al abrirlo enseña los 5 campos que fallan.
- `npm test` (17 tests), `npm run lint` y `npm run build` pasan sin avisos.

## Estructura

```
src/
├── main.jsx                  QueryClient (staleTime, retry) + QueryClientProvider
├── App.jsx                   solo reparte la pantalla: formulario | listado
├── schemas/receta.js         ★ esquema Zod: única fuente de verdad (formulario, vista previa y API)
├── services/                 capa de servicios: lo único que sabe de URLs y fetch
│   ├── http.js               pedirJson, ErrorHttp / ErrorDatos / ErrorConfiguracion, mensajeDeError
│   └── recetas.js            listarRecetas, crearReceta, borrarReceta, validarLista (safeParse)
├── queries/recetas.js        TanStack Query: fábrica de claves + useRecetas, useCrearReceta, useBorrarReceta
├── logic/                    funciones puras: normalizar, formatearMinutos, ingredientesUsados, palabraAnimal
├── components/               solo UI (11 ficheros; el más largo, FormularioReceta, 125 líneas)
└── styles/                   base, formulario y listado
api/semilla.json              datos de partida de json-server (con la receta corrupta)
.env.example                  VITE_API_URL (el .env real está en .gitignore)
```

```
App
├── FormularioReceta          useForm + zodResolver + useCrearReceta
│   ├── Campo / MensajeError  etiqueta + input + error enlazado con aria-describedby
│   ├── CamposIngredientes    useFieldArray → FilaIngrediente
│   │   └── SugerenciasIngredientes   datalist con los ingredientes de la comunidad
│   ├── VistaPrevia           useWatch: cómo quedará y cuántos campos están listos
│   └── EstadoEnvio           éxito / error de la mutación
└── Listado                   useRecetas(categoria)
    ├── FiltroCategorias
    ├── AvisoCorruptas        las recetas que Zod descartó y por qué
    ├── Estado                cargando / error + Reintentar / vacío
    └── TarjetaReceta         useBorrarReceta propio
```

## React Hook Form (formulario no controlado)

- Todos los inputs nativos usan `register`: texto, `select`, radios, checkbox, números y `textarea`. **No hay `Controller`** (no hace falta con inputs nativos) **ni un `useState` por campo**: React no se re-renderiza en cada tecla.
- Los números se registran con `valueAsNumber: true`. Un número vacío llega como `NaN` y Zod lo rechaza con «Escribe los minutos con números».
- Los ingredientes son una lista dinámica con `useFieldArray` (`append` / `remove`). La `key` de cada fila es `campo.id`, que genera RHF y no cambia al borrar una fila de en medio. «Añadir» se desactiva al llegar a 12 y «×» al quedar 2, con los mismos límites que el esquema (`MIN_INGREDIENTES`, `MAX_INGREDIENTES`).
- `mode: "onTouched"`: no se grita mientras escribes por primera vez. El error sale al salir del campo y, a partir de ahí, se actualiza mientras lo corriges.
- `handleSubmit` solo llama a la mutación si Zod da el visto bueno, y le pasa los datos ya limpios (`trim` aplicado). RHF lleva el foco al primer campo con error.
- Tras publicar, `reset()` vuelve a `RECETA_VACIA`. Si falla, no se resetea: no pierdes lo escrito.
- **Errores accesibles**: cada campo tiene su `<label>`, `aria-invalid` y `aria-describedby` apuntando a su mensaje (`ariaDeCampo`). La dificultad es un `fieldset` con `legend` y `role="radiogroup"`. El aviso «Revisa los N campos marcados» lleva `role="alert"`. El HTML lleva `noValidate` para que valide solo Zod, con sus mensajes, y no el navegador.

## Zod: el esquema es la única fuente de verdad

`src/schemas/receta.js` define los campos, los límites y los mensajes, todo en español. Lo usan:

1. el formulario, con `zodResolver(esquemaReceta)`;
2. la vista previa, que pregunta al esquema campo a campo cuántos están listos (`camposReceta.shape[campo].safeParse`) y si la receta entera vale;
3. el servicio, que valida la respuesta del API con `esquemaRecetaApi`, que es `camposReceta.extend({ id, creada })`.

Las categorías y dificultades de los `select`, de los radios y de los filtros salen del mismo `CATEGORIAS` / `DIFICULTADES` del esquema.

Refinamientos:

| Regla | Cómo | Dónde sale el error |
|---|---|---|
| Ingredientes sin repetir (sin contar mayúsculas ni tildes) | `superRefine` en el array, con `normalizar` | en el ingrediente repetido (`path: [indice, "nombre"]`) |
| Una receta **fácil** no pasa de 45&nbsp;min | `refine` entre `dificultad` y `minutos` | en los minutos |
| Una receta **vegana** no lleva ingredientes animales (pollo, huevo, leche…), pero sí «leche de avena» o «queso vegano» | `superRefine` con `palabraAnimal` | en el ingrediente que no es vegano |
| Texto vacío o con solo espacios | `trim()` antes de `min(1)` | «Escribe…» primero; «al menos N caracteres» si es corto |

Los dos refinamientos entre campos llevan `when`: saltan en cuanto **esos** campos son válidos, sin esperar a que esté bien todo el formulario. Sin `when`, Zod 4 no comprobaría la regla de «fácil» hasta que el nombre, los pasos y todo lo demás estuvieran bien.

## TanStack Query v5

**Claves jerárquicas** con una fábrica en `queries/recetas.js`:

```js
clavesRecetas.todo        // ["recetas"]
clavesRecetas.listas()    // ["recetas", "lista"]
clavesRecetas.lista(cat)  // ["recetas", "lista", { categoria: cat }]
```

- **Cada filtro tiene su caché**: la categoría va dentro de la clave. Con `staleTime` de 30&nbsp;s, volver a un filtro ya visto no repite la petición.
- **Una petición compartida**: el datalist de sugerencias usa `useRecetas("todas")`, la misma clave que el listado sin filtro, así que TanStack Query hace **una sola petición** para los dos. Se ve en la pestaña Network.
- **Invalidación**: crear y borrar invalidan `clavesRecetas.listas()`, que son todas las listas y todos los filtros a la vez, y nada más. El `onSuccess` **devuelve** la promesa de `invalidateQueries`, así la mutación sigue en «Publicando…» hasta que la lista nueva ya está pintada.
- **Cancelación**: `queryFn: ({ signal }) => listarRecetas({ categoria, signal })` pasa el `AbortSignal` a `fetch`. En desarrollo, StrictMode monta dos veces y en Network sale una petición `ERR_ABORTED` seguida de la buena: es la cancelación funcionando.
- **Reintentos con criterio**: `retry` reintenta los fallos de red, pero no un `ErrorDatos` (datos corruptos) ni un `ErrorConfiguracion` (falta `.env`), porque fallarían igual.
- **Sin `useEffect` en toda la app**: ninguno. Ni `useEffect` + `fetch` ni para sincronizar nada.

## Experiencia de usuario: cargando, error y éxito

| Situación | Qué se ve |
|---|---|
| Primera carga del listado (`isPending`) | girador + «Cargando recetas…» (`role="status"`) |
| Refresco con datos ya en pantalla (`isFetching`) | «Actualizando…» pequeño al lado del título; la lista no desaparece |
| Error del listado | mensaje según el tipo (sin conexión / 5xx / 4xx / datos raros / falta `.env`) + «Reintentar» (`refetch`) |
| Lista vacía | «Todavía no hay recetas de Postre. ¡Publica la primera!» |
| Publicando | botón «Publicando…» desactivado, también «Vaciar» |
| Publicada | aviso verde con el nombre (`role="status"`) y formulario vacío |
| Error al publicar | `role="alert"` con el motivo y «Tus datos siguen en el formulario» |
| Borrando | «Borrando…» solo en esa tarjeta (cada tarjeta tiene su propia mutación) |

## Originalidad

- **Reglas de cocina en el esquema**: «vegana» que de verdad comprueba los ingredientes (y entiende «leche de avena»), «fácil» con límite de tiempo e ingredientes repetidos aunque cambien las tildes.
- **Vista previa en vivo** (`useWatch`) con una barra `<meter>` de campos listos que calcula el propio esquema. Distingue «faltan campos» de «falta cumplir una regla».
- **Sugerencias de ingredientes** con los que ya usa la comunidad, sacadas de la caché de TanStack Query sin hacer ninguna petición extra.
- **Ctrl/⌘ + Enter** publica desde el `textarea`.
- **Bonus** con aviso visible: qué receta se descartó y qué 5 campos fallaban.

## Bonus: Zod también valida la respuesta del API

`validarLista` (en `services/recetas.js`) comprueba con `safeParse` que la respuesta es un array y luego valida **cada receta por separado** con `esquemaRecetaApi`. Las buenas pasan, ya tipadas, con `id` siempre texto y ordenadas por fecha. Las corruptas se descartan y se guardan con sus problemas. `crearReceta` también valida lo que devuelve el `POST`.

La semilla trae la receta con id `5` rota a propósito: sin autor, categoría «Cena» (no existe), `"raciones": "muchas"`, `"ingredientes": null` y `"creada": "ayer"`. **Demostración**:

- en la app: el aviso rojo encima del listado;
- en los tests (`src/services/recetas.test.js`): se carga `api/semilla.json` tal cual y se comprueba que salen 4 recetas válidas, 1 descartada (la `5`) y exactamente los 5 mensajes de lo que falla.

## Reglas del enunciado

| Regla | Cómo se cumple |
|---|---|
| Sin `useEffect` + `fetch` donde toca `useQuery` | 0 `useEffect`; todo con `useQuery` / `useMutation` |
| Sin `Controller` en inputs nativos | 0 `Controller`; todo con `register` |
| Sin el token en `localStorage` | la app no usa tokens ni guarda nada en `localStorage`. La API local no tiene autenticación; si la tuviera, el token iría en memoria o en una cookie `HttpOnly` |
| Capa de servicios | `src/services/`: los componentes no ven URLs ni `fetch` |
| `.env` fuera de git, `.env.example` | `.gitignore` ignora `.env*` salvo `.env.example`. Si falta `VITE_API_URL`, la app lo dice en pantalla |

## Lo que apliqué de la corrección de la M3

| La Arena dijo en la M3 | Cómo está en la M4 |
|---|---|
| Prop drilling de callbacks por varios niveles | cada `TarjetaReceta` usa su propio `useBorrarReceta`; formulario y listado se comunican por la caché de TanStack Query, no por props desde `App` |
| `datos?.[0][0]`, poco legible | nombres en todo: `const { recetas, descartadas } = data`, `errorDeLista`, `error={errores?.[indice]}` en una fila con nombre |
| Clave de `useFetch` «ingeniosa» (`urls.join(" ")`) | ya no hay `useFetch`: claves de TanStack Query explícitas con una fábrica |
| `Detalle` mezclaba petición, modal y contenido | red en `services/`, caché en `queries/`, estado de envío en `EstadoEnvio`, elección del contenido en `ContenidoListado` |
| Originalidad: «algo inesperado» | reglas de cocina en el esquema, vista previa con progreso y sugerencias desde la caché |

## Tests

`npm test` lanza **17 tests con Vitest**:

- `schemas/receta.test.js`: receta válida con `trim`, mensajes propios, repetidos con tildes y mayúsculas, regla de «fácil» (también cuando otro campo está mal, gracias a `when`), vegana sí y no, y mínimo de ingredientes.
- `services/recetas.test.js`: el **bonus**. Atrapa la receta corrupta de la semilla, ordena por fecha, convierte el id a texto y lanza `ErrorDatos` si no llega una lista.
- `logic/logica.test.js`: `normalizar`, `formatearMinutos`, `palabraAnimal` (con «leche de avena») e `ingredientesUsados`.

## Accesibilidad y detalles

Un `<h1>`, `lang="es"`, etiquetas en todos los campos (las de los ingredientes, ocultas con `.sr-only`), `aria-invalid` + `aria-describedby`, botones de icono con `aria-label` («Quitar el ingrediente 2»), filtros con `aria-pressed`, `aria-busy` en el listado, foco visible, objetivos táctiles de 44&nbsp;px, inputs a 16&nbsp;px (iOS no hace zoom), `prefers-reduced-motion`, sin scroll horizontal a 375&nbsp;px y consola limpia.

## Uso de IA

Usé **Claude Code** (Claude Opus) como pareja de programación, igual que en las misiones anteriores.

**Qué pedí.** Primero le pasé la corrección de la M3 para que la guardara en mis notas del curso. Después le pasé el enunciado y la rúbrica de la M4. El prompt real fue:

> «Vale eso es lo que tienes que hacer. Ten en cuenta cómo corrige la IA para tenerlo todo a su gusto y sacar la mejor nota posible. Aparte hazlo de la manera más sencilla posible pero a su vez para sacar la máxima nota posible.»

La IA propuso seguir con el tema de la nevera (un recetario comunitario), las reglas de cocina en el esquema, `json-server` como API y la receta corrupta en la semilla para el bonus. Lo implementó por fases, con un commit por fase.

**Qué hizo la IA y qué decidí yo.** El código lo generó la IA; no lo escribí a mano. Yo decidí que fuese sencillo, que siguiera la línea de la nevera y que aplicara lo que la Arena me pidió en la M3. Después revisé cada fichero hasta poder explicarlo: por qué `register` y no `Controller`, qué hace `when` en los refinamientos, por qué la clave lleva la categoría y qué invalida cada mutación.

**Cómo lo verifiqué.** Con la API y la app abiertas en el navegador probamos:

- publicar vacío: 9 errores, foco en el primero y el resumen;
- la regla vegana con «Leche entera» y luego con «Leche de avena»;
- «fácil» con 60 minutos: error, y desaparece al cambiar a «media»;
- publicar con Ctrl+Enter, que la receta aparezca arriba y el formulario se vacíe;
- en Network: **una sola** `GET /recetas` al cargar (la comparten el listado y las sugerencias), `POST` y después una única `GET` por la invalidación, y `GET ?categoria=Postre` al filtrar;
- borrar;
- apagar la API: error del listado con «Reintentar», y error al publicar sin perder los datos;
- el aviso de la receta corrupta;
- móvil a 375&nbsp;px sin scroll horizontal y escritorio a 1280&nbsp;px.

Al probarlo cambiamos tres cosas:

- los campos vacíos decían «al menos 3 caracteres» y ahora dicen «Escribe…»;
- en el aviso de corruptas salían dos líneas para el mismo campo y un mensaje en inglés;
- la vista previa decía «9 de 9 campos listos» aunque fallaba la regla vegana.

`npm test`, `npm run lint` y `npm run build` pasan y la consola queda limpia.

## Autopsia

**1. Invalidar la lista en vez de actualizar la caché a mano.** Tras publicar o borrar, `invalidateQueries` vuelve a pedir la lista al servidor (una petición más). La alternativa **descartada** era `setQueryData` o una actualización optimista: meter la receta nueva en la caché sin esperar al servidor. Es más rápido para el usuario, pero hay que insertarla en cada lista filtrada que le toque (todas, la de su categoría), mantener el orden y deshacerlo si el servidor falla. Con una API local la petición extra tarda milisegundos, así que gana lo sencillo y lo que siempre coincide con el servidor. Para que no se note, la mutación espera a la invalidación y el «Publicando…» dura hasta que la receta ya se ve.

**2. Una receta corrupta no tumba la lista entera.** Lo más sencillo era validar la respuesta con `z.array(esquemaRecetaApi)`: si un elemento está mal, falla todo y se enseña un error. Lo **descarté** porque un registro roto dejaría la app sin ninguna receta. Ahora se valida cada receta por separado: las buenas se muestran y las malas se cuentan y se explican. Lo discutible es que una respuesta mal formada «a medias» no se trata como error, sino como aviso. Si el servidor lo devolviera todo corrupto, se vería el aviso con N recetas descartadas y la lista vacía.

**Otras decisiones que defiendo:**

- `json-server` local en vez de una API pública: las públicas de prueba no guardan los `POST`, así que la invalidación no se podría ver. Además, la semilla me deja meter el dato corrupto.
- `mode: "onTouched"` en vez de `onChange`: no se marcan errores mientras escribes por primera vez.
- La lista de palabras animales en `logic/vegano.js` en vez de un campo «tipo» por ingrediente: es corta, se puede revisar a mano y está testeada.
