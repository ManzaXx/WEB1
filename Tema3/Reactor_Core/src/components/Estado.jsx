// Mensaje de estado reutilizable: cargando, error o vacío.
// `children` es el texto y `accion` un botón opcional (por ejemplo, reintentar).
export default function Estado({ tipo = "vacio", children, accion }) {
  const rol = tipo === "error" ? "alert" : "status";
  return (
    <div className={`estado estado--${tipo}`} role={rol}>
      {tipo === "cargando" && <span className="estado__girador" aria-hidden="true" />}
      <p>{children}</p>
      {accion}
    </div>
  );
}
