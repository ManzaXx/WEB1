// Una línea de la lista de ingredientes. Tres casos que se excluyen:
// lo tienes, tienes algo que lo sustituye, o te falta (y quizá tiene alternativa).
export default function Ingrediente({ nombre, medida, enNevera, sustituto, alternativa }) {
  const cubierto = enNevera || sustituto;

  let marca = null;
  if (enNevera) {
    marca = <span className="ingrediente__marca">en tu nevera</span>;
  } else if (sustituto) {
    marca = <span className="ingrediente__marca">usa tu {sustituto}</span>;
  } else if (alternativa) {
    marca = <span className="ingrediente__alternativa">o {alternativa}</span>;
  }

  return (
    <li className={cubierto ? "ingrediente ingrediente--tienes" : "ingrediente"}>
      <span className="ingrediente__nombre">{nombre}</span>
      {medida && <span className="ingrediente__medida">{medida}</span>}
      {marca}
    </li>
  );
}
