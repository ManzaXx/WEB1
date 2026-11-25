// Ejercicio 01 · Hola componente
// Un componente es una función que recibe props y devuelve JSX.

function Saludo({ nombre }) {
  return <p className="saludo">Hola, {nombre}</p>;
}

export default function Ej01Saludo() {
  return (
    <div className="ejercicio">
      <Saludo nombre="Lucía" />
      <Saludo nombre="Mario" />
      <Saludo nombre="Aitana" />
    </div>
  );
}
