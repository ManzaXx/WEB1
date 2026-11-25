// Ejercicio 13 · El monedero del ejercicio 05 pasado a TypeScript

// Forma del objeto que devuelve crearMonedero: tres métodos y nada más
// (el saldo no aparece porque es privado)
interface Monedero {
  ingresar(n: number): number;
  retirar(n: number): number;
  consultar(): number;
}

export function crearMonedero(saldoInicial: number = 0): Monedero {
  let saldo: number = saldoInicial;

  return {
    ingresar(n: number): number {
      if (n <= 0) throw new Error("La cantidad a ingresar debe ser positiva");
      saldo += n;
      return saldo;
    },
    retirar(n: number): number {
      if (n <= 0) throw new Error("La cantidad a retirar debe ser positiva");
      if (n > saldo) throw new Error(`Saldo insuficiente: tienes ${saldo} € y pides ${n} €`);
      saldo -= n;
      return saldo;
    },
    consultar(): number {
      return saldo;
    },
  };
}

const monedero = crearMonedero(50);
monedero.ingresar(20);
console.log(`Saldo: ${monedero.consultar()} €`);

// ERRORES PROVOCADOS A PROPÓSITO
// Sin la línea @ts-expect-error, el editor los subraya en rojo y `npm run check` falla con el
// mensaje que se copia en cada comentario. Con @ts-expect-error decimos "aquí espero un error":
// el proyecto compila, y si un día el error desapareciera, sería TypeScript quien avisaría.

// @ts-expect-error  → TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
monedero.ingresar("20");

// @ts-expect-error  → TS2339: Property 'saldo' does not exist on type 'Monedero'.
console.log(monedero.saldo);
