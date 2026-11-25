// Ejercicio 05 · Closure crearMonedero con saldo privado

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

function crearMonedero(saldoInicial = 0) {
  let saldo = saldoInicial; // privada: solo la ven los tres métodos de abajo

  return {
    ingresar(n) {
      if (n <= 0) throw new Error("La cantidad a ingresar debe ser positiva");
      saldo += n;
      return saldo;
    },
    retirar(n) {
      if (n <= 0) throw new Error("La cantidad a retirar debe ser positiva");
      if (n > saldo) throw new Error(`Saldo insuficiente: tienes ${saldo} € y pides ${n} €`);
      saldo -= n;
      return saldo;
    },
    consultar() {
      return saldo;
    },
  };
}

const monedero = crearMonedero(50);
mostrar(`Saldo inicial: ${monedero.consultar()} €`);
mostrar(`Ingreso 20 → ${monedero.ingresar(20)} €`);
mostrar(`Retiro 30 → ${monedero.retirar(30)} €`);

try {
  monedero.retirar(100); // dejaría el saldo en negativo
} catch (error) {
  mostrar(`Error al retirar 100: ${error.message}`);
}

mostrar(`El saldo no ha cambiado: ${monedero.consultar()} €`);
// El saldo no es una propiedad del objeto, así que no se puede leer ni tocar desde fuera
mostrar(`monedero.saldo → ${monedero.saldo}`); // undefined
