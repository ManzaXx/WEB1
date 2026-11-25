# Misiones de clase · Tema 3 (React Core)

Aquí van los ejercicios y misiones que se hacen en clase durante el Tema 3. La entrega evaluable del tema es la M3, que está en [`../Reactor_Core/`](../Reactor_Core/).

Lo más cómodo es un único proyecto Vite + React para todos los ejercicios (`npm create vite@latest ejercicios -- --template react`), con un componente por ejercicio en `src/ejercicios/`. Recuerda el `.gitignore` con `node_modules/` y `dist/`. Marca la casilla cuando esté subido.

Están en [`ejercicios/`](./ejercicios/): `npm install` y `npm run dev`, y el menú de la izquierda abre cada uno (ver su [README](./ejercicios/README.md)).

## Ejercicios propuestos del tema

- [x] [01](./ejercicios/src/ejercicios/Ej01Saludo.jsx) · Hola componente: `Saludo` con la prop `nombre`, pintado tres veces
- [x] [02](./ejercicios/src/ejercicios/Ej02Tarjeta.jsx) · Tarjeta de perfil con `children` y «En línea» con `&&`
- [x] [03](./ejercicios/src/ejercicios/Ej03ContadorMas3.jsx) · Contador «+3» con la función actualizadora `(c) => c + 1`
- [x] [04](./ejercicios/src/ejercicios/Ej04ListaTareas.jsx) · Lista de tareas sin mutar el estado y con `key` estable
- [x] [05](./ejercicios/src/ejercicios/Ej05FiltroDerivado.jsx) · Filtro derivado: la lista filtrada se calcula en el render, no es estado
- [x] [06](./ejercicios/src/ejercicios/Ej06Reloj.jsx) · Reloj con `useEffect`, `setInterval` y su limpieza (montar/desmontar)
- [x] [07](./ejercicios/src/ejercicios/Ej07LevantarEstado.jsx) · Levantar el estado entre dos componentes hermanos
- [x] [08](./ejercicios/src/ejercicios/Ej08TemaContext.jsx) · Tema claro/oscuro con `createContext` y `useContext`
- [x] [09](./ejercicios/src/ejercicios/Ej09Carrito.jsx) · Carrito con `useReducer`
- [x] [10](./ejercicios/src/ejercicios/Ej10AntiEfecto.jsx) · Reto: refactor anti-efecto (quitar un `useEffect` que solo calcula un total)

## Otras misiones de clase

- [ ] A1 · Code review al replicante (`Leaderboard.jsx`: 3 fallos y 2 malas prácticas)
- [ ] Reto jefe del cuaderno 3
- [ ] Reto opcional con `useActionState` (adelanto de la U4)
