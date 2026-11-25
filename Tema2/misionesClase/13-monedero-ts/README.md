# Ejercicio 13 · De JavaScript a TypeScript

El monedero del [ejercicio 05](../05-monedero/app.js) con tipos, en [`monedero.ts`](monedero.ts):

- Parámetros y valores de retorno anotados (`n: number`, `: number`).
- Una `interface Monedero` para el objeto que devuelve `crearMonedero`. El saldo no está en la interfaz porque es privado: TypeScript tampoco deja leerlo desde fuera.

## Probarlo

```bash
npm install
npm run check   # tsc --noEmit: solo comprueba los tipos, no genera ficheros
```

## Errores provocados a propósito

Al final del fichero hay dos. Quitando la línea `// @ts-expect-error` de encima de cada uno, el editor los subraya y `npm run check` falla con:

```
monedero.ts(42,19): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
monedero.ts(45,22): error TS2339: Property 'saldo' does not exist on type 'Monedero'.
```

En el ejercicio 05, en JavaScript, `ingresar("20")` no daba error: el `+=` concatenaba y el saldo acababa siendo el texto `"5020"`. TypeScript lo detecta antes de ejecutar nada.
