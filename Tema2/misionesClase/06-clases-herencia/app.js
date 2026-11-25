// Ejercicio 06 · Clases y herencia

const salida = document.querySelector("#salida");

function mostrar(texto) {
  console.log(texto);
  salida.textContent += texto + "\n";
}

class Figura {
  constructor(nombre) {
    this.nombre = nombre;
  }

  // Método "abstracto": cada subclase tiene que sobreescribirlo
  area() {
    throw new Error(`area() no implementado en ${this.nombre}`);
  }
}

class Circulo extends Figura {
  constructor(radio) {
    super("Círculo"); // llama al constructor de Figura
    this.radio = radio;
  }

  area() {
    return Math.PI * this.radio ** 2;
  }
}

class Rectangulo extends Figura {
  constructor(base, altura) {
    super("Rectángulo");
    this.base = base;
    this.altura = altura;
  }

  area() {
    return this.base * this.altura;
  }
}

const figuras = [new Circulo(1), new Rectangulo(3, 4), new Circulo(2.5)];

for (const f of figuras) {
  mostrar(`${f.nombre}: ${f.area().toFixed(2)}`);
}

// reduce acumula las áreas empezando en 0
const areaTotal = figuras.reduce((total, f) => total + f.area(), 0);
mostrar(`Área total: ${areaTotal.toFixed(2)}`);

// Una Figura "a secas" no sabe calcular su área
try {
  new Figura("Figura genérica").area();
} catch (error) {
  mostrar(`Error esperado: ${error.message}`);
}
