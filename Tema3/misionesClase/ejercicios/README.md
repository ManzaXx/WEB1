# Ejercicios de clase · Tema 3 (React Core)

Los 10 ejercicios propuestos de los apuntes del Tema 3 (React Core) en un único proyecto Vite + React 19. Cada ejercicio es un componente de [`src/ejercicios/`](src/ejercicios/) y [`src/App.jsx`](src/App.jsx) tiene un menú para abrirlos.

```bash
npm install
npm run dev     # http://localhost:5173
npm run lint    # oxlint
```

| Nº | Fichero | Qué se practica |
|---|---|---|
| 01 | [`Ej01Saludo.jsx`](src/ejercicios/Ej01Saludo.jsx) | Componente `Saludo` con la prop `nombre`, pintado tres veces |
| 02 | [`Ej02Tarjeta.jsx`](src/ejercicios/Ej02Tarjeta.jsx) | Props, `children` y «En línea» con `&&` |
| 03 | [`Ej03ContadorMas3.jsx`](src/ejercicios/Ej03ContadorMas3.jsx) | Botón «+3» con la función actualizadora `(c) => c + 1`, y al lado la versión que falla con `cuenta + 1` |
| 04 | [`Ej04ListaTareas.jsx`](src/ejercicios/Ej04ListaTareas.jsx) + [`tareas.js`](src/ejercicios/tareas.js) | Añadir, marcar y borrar sin mutar el array (spread, `map`, `filter`) y `key` estable |
| 05 | [`Ej05FiltroDerivado.jsx`](src/ejercicios/Ej05FiltroDerivado.jsx) | Búsqueda sobre el 04: la lista filtrada se calcula en el render, no es estado |
| 06 | [`Ej06Reloj.jsx`](src/ejercicios/Ej06Reloj.jsx) | `useEffect` + `setInterval` con su limpieza; botón para montar y desmontar (mira la consola) |
| 07 | [`Ej07LevantarEstado.jsx`](src/ejercicios/Ej07LevantarEstado.jsx) | Estado en el padre común de dos hermanos |
| 08 | [`Ej08TemaContext.jsx`](src/ejercicios/Ej08TemaContext.jsx) | `createContext` + `useContext`: un componente profundo lee el tema sin prop drilling |
| 09 | [`Ej09Carrito.jsx`](src/ejercicios/Ej09Carrito.jsx) | Carrito (añadir, quitar, vaciar) con `useReducer` |
| 10 | [`Ej10AntiEfecto.jsx`](src/ejercicios/Ej10AntiEfecto.jsx) | El total con `useEffect` (antes) y calculado en el render (después), con la justificación de «You Might Not Need an Effect» |
