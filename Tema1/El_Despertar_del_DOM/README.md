# Cyber Memory

Misión M1 · El Despertar del DOM — Web Development I.

Juego de memoria (parejas) con temática de terminal «cyber»: 16 cartas, 8 parejas de iconos, contador de intentos, cronómetro y mensaje de victoria. Hecho con HTML, CSS y JavaScript puro, sin frameworks ni librerías.

## Cómo probarlo

Abre `index.html` en el navegador (o con Live Server).

- Haz clic en dos cartas para darles la vuelta. Si coinciden, se quedan descubiertas; si no, se vuelven a tapar.
- El cronómetro arranca al cargar la página y se para al encontrar las 8 parejas.
- «Reiniciar» baraja de nuevo y pone el marcador y el tiempo a cero.
- **Tecla secreta:** pulsa `M` para activar/desactivar el modo terminal oscuro.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura de la página. El tablero está vacío: las cartas se crean desde JS. Ningún handler inline. |
| `styles.css` | Estilos, variables CSS en `:root` y su redefinición en `body.dark-mode`. |
| `app.js` | Estado del juego, creación de las cartas, eventos, temporizador y modo oscuro. |

## Qué se ha trabajado del DOM

- **Selección:** las referencias a los nodos se guardan una sola vez al inicio con `querySelector`.
- **Creación:** las 16 cartas se generan con `document.createElement('button')`, `classList` y `dataset`; el tablero se vacía con `replaceChildren()` al reiniciar.
- **Modificación:** todo el texto se escribe con `textContent` (nunca `innerHTML`) y el aspecto cambia con clases (`revealed`, `matched`, `hidden`, `dark-mode`).
- **Eventos:** todo con `addEventListener`. Un único listener en el tablero (delegación con `closest('.card')`), otro en el botón de reinicio y un `keydown` en `document` para el modo oscuro.
- **Fundamentos JS:** `const`/`let` (sin `var`), template literals, funciones flecha, desestructuración y barajado Fisher-Yates.

## Uso de IA

Usé Gemini para crear la idea y como pareja de programación y Claude Code para la revisión final. La idea del juego (un memory con estética de terminal «cyber») y las decisiones de diseño las fui marcando yo.

Primer prompt real: le pasé el enunciado completo de la misión con

> "necesito hacer esta entrega, ayúdame: M1 · El Despertar del DOM [...]"

y a partir de ahí fuimos por fases, que son las que se ven en los commits: HTML → CSS → primera parte del JS → JS completo → mejoras de CSS.

Segundo prompt real, cuando el juego ya funcionaba y el aspecto no me convencía:

> "está guay pero en el CSS vamos a mejorar un poco, sobre todo la parte del título que está un poco cutre, hay un título más chulo y añade un par de detalles tontos por los bordes pero que sean luego simples de entender y explicar, no cosas muy difíciles"

De ahí salen el título con degradado (`background-clip: text`), la etiqueta `● SECURE_TERMINAL_V1` con `header::before` y la línea luminosa de arriba con `.game-container::before`. Pedí expresamente que fueran cosas sencillas para poder explicarlas.

**Revisión final con Claude Code:** le pedí que revisara el código con la rúbrica sin cambiar nada. Me señaló cuatro fallos pequeños, que después corregimos:
- `estado` estaba declarado con `let` aunque nunca se reasigna → ahora es `const`.
- `estado.cartas` se guardaba pero nunca se leía → eliminado.
- Si pulsabas «Reiniciar» justo después de fallar una pareja, el `setTimeout` de 850 ms seguía vivo y vaciaba la selección de la partida nueva → ahora guardo su referencia en `estado.ocultarRef` y hago `clearTimeout` al reiniciar.
- El `aria-label` de la carta no cambiaba al voltearla → ahora pasa a `Carta <icono>` y vuelve a `Carta oculta`.

También renombré `Index.html` a `index.html`. Este README lo redacté con Claude Code a partir de mis prompts y lo revisé antes de subirlo.

**Cómo lo verifiqué:** jugando partidas completas después de cada fase y probando los casos límite: clic dos veces en la misma carta, clic en una tercera carta mientras se tapan dos, clic en una carta ya emparejada, reiniciar a mitad de partida (y justo después de fallar) y pulsar `M` varias veces.

## Autopsia

1. **Un solo listener en el tablero (delegación) en lugar de uno por carta.** Como las cartas se destruyen y se crean de nuevo en cada reinicio, con 16 listeners habría que volver a engancharlos cada vez y es fácil acabar con eventos duplicados. Con `closest('.card')` sobre el contenedor, que nunca se recrea, basta un listener para siempre. Descarté añadir el listener a cada `button` dentro del `forEach` que crea las cartas.

2. **El valor de cada carta vive en `data-valor` y solo se escribe en `textContent` al voltearla.** Así la carta tapada no muestra el icono en el DOM visible y la comparación se hace con `dataset.valor`. Descarté escribir el icono desde el principio y ocultarlo solo con CSS (color transparente u `opacity`), porque se vería al seleccionar el texto o con un lector de pantalla. También descarté comparar las cartas por su clase CSS, porque eso acopla la lógica al aspecto.
