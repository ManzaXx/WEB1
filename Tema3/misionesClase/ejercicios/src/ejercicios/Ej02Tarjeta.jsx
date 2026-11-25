// Ejercicio 02 · Tarjeta de perfil con children y renderizado condicional con &&

function Tarjeta({ nombre, rol, online, children }) {
  return (
    <article className="tarjeta">
      <h3 className="tarjeta__nombre">{nombre}</h3>
      <p className="tarjeta__rol">{rol}</p>
      {/* && solo pinta lo de la derecha si online es true.
          Ojo: con un número (0 && …) React pintaría el 0; aquí online es booleano */}
      {online && (
        <p className="tarjeta__online">
          <span className="punto-verde" aria-hidden="true"></span> En línea
        </p>
      )}
      {/* children: lo que se escribe entre <Tarjeta> y </Tarjeta> */}
      <div className="tarjeta__descripcion">{children}</div>
    </article>
  );
}

export default function Ej02Tarjeta() {
  return (
    <div className="ejercicio rejilla">
      <Tarjeta nombre="Nerea Ortiz" rol="Diseñadora de producto" online={true}>
        <p>Se encarga de los prototipos y de las pruebas con usuarios.</p>
      </Tarjeta>
      <Tarjeta nombre="Hugo Pastor" rol="Desarrollador frontend" online={false}>
        <p>Mantiene la librería de componentes del equipo.</p>
      </Tarjeta>
    </div>
  );
}
