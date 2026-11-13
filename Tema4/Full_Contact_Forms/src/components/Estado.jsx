// Mensaje de cargando / error / vacío del listado.
export default function Estado({ tipo, children, onReintentar }) {
  const esError = tipo === "error";
  return (
    <div className={`estado estado--${tipo}`} role={esError ? "alert" : "status"}>
      {tipo === "cargando" && <span className="estado__girador" aria-hidden="true" />}
      <p>{children}</p>
      {esError && (
        <button type="button" className="boton" onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
