# Ejercicio 12 · Explorar las DevTools

Web explorada: **https://developer.mozilla.org/es/** (MDN en español), el 25/11/2026.

## Pestaña Elements: cambiar un titular en vivo

1. F12 → pestaña **Elements**.
2. Con el selector de elementos (la flecha de arriba a la izquierda, o `Ctrl`&nbsp;+&nbsp;`Shift`&nbsp;+&nbsp;`C`) pulso el titular principal de la portada, el `<h1>`.
3. Doble clic sobre su texto en el árbol del DOM, escribo uno nuevo e `Intro`.

| | Texto del `<h1>` |
|---|---|
| Antes | «Recursos para desarrolladores, por desarrolladores» |
| Después | «Titular cambiado en vivo desde las DevTools» |

El cambio se ve al instante en la página, pero **solo existe en mi navegador**: estoy editando el DOM que ha construido el navegador, no el HTML del servidor. Al recargar vuelve el titular original.

## Pestaña Network: la petición del documento HTML

1. F12 → pestaña **Network** y recargo con `F5` (con las DevTools abiertas, para que registre todo desde el principio).
2. La primera fila, de tipo **document**, es la petición del HTML (`/es/`). Todo lo demás (CSS, JS, imágenes, fuentes) lo pide el navegador después, al leer ese HTML.

| Dato | Valor anotado |
|---|---|
| URL | `https://developer.mozilla.org/es/` |
| Método | `GET` |
| Código de estado | **200** (OK) |
| Protocolo | HTTP/2 (`h2`) |
| Tamaño transferido | ~14,5&nbsp;KB (comprimido) |
| Tiempo hasta el primer byte (TTFB) | ~117&nbsp;ms |
| Tiempo de carga del documento | ~429&nbsp;ms (`DOMContentLoaded` a los ~294&nbsp;ms) |

Los tiempos cambian en cada recarga según la red y la caché; si el documento sale como `304 Not Modified` es que el navegador tenía una copia y el servidor le ha dicho que sigue valiendo (con `Ctrl`&nbsp;+&nbsp;`F5` se fuerza una descarga nueva y vuelve a dar `200`).
