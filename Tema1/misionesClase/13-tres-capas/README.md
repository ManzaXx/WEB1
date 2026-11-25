# Ejercicio 13 · Las tres capas de un botón «Me gusta»

El ejemplo está montado en esta carpeta: [`index.html`](index.html) (HTML), [`styles.css`](styles.css) (CSS) y [`app.js`](app.js) (JavaScript).

## Qué hace cada capa

- **HTML (estructura y significado).** Es lo que *es* el botón: un `<button>` dentro de un `<form>` que apunta a `/me-gusta`, el texto «Me gusta», el número de «me gusta» y el atributo `aria-pressed`, que dice a un lector de pantalla si está pulsado o no. El HTML es lo que se puede usar con teclado y lo que entiende un buscador o un lector de pantalla.
- **CSS (presentación).** Es cómo *se ve*: el borde, los colores, el corazón en rojo cuando está marcado (con el selector `button[aria-pressed="true"]`) y el foco visible al llegar con el tabulador. Si quito el CSS, el botón sigue estando ahí y funciona, solo que con el aspecto por defecto del navegador.
- **JavaScript (comportamiento).** Es lo que *hace* al momento: escucha el envío del formulario, cambia `aria-pressed`, suma o resta uno al contador sin recargar la página y, en una red social real, mandaría el voto al servidor con `fetch`.

## Qué seguiría funcionando sin JavaScript (mejora progresiva)

Como el botón es un formulario de verdad, sin JavaScript seguiría pudiendo pulsarse: el navegador enviaría el formulario a `/me-gusta`, el servidor guardaría el voto y devolvería la página con el contador ya actualizado. Se pierde la parte cómoda (se recarga la página entera y no hay cambio instantáneo), pero la función básica no se rompe. Eso es la mejora progresiva: primero algo que funciona con HTML, y JavaScript lo mejora por encima. Si el botón fuera un `<div>` con un `onclick`, sin JavaScript no haría nada.
