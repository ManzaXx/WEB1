// Ejercicio 06 · Reloj con useEffect, setInterval y su limpieza
import { useEffect, useState } from "react";

const formatoHora = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function Reloj() {
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    console.log("Reloj montado: arranco el intervalo");
    const id = setInterval(() => setAhora(new Date()), 1000);

    // Limpieza: React la ejecuta al desmontar (y antes de repetir el efecto).
    // Sin ella el intervalo seguiría vivo llamando a setAhora de un componente que ya no existe.
    return () => {
      clearInterval(id);
      console.log("Reloj desmontado: intervalo limpiado");
    };
  }, []); // [] → el efecto solo se ejecuta al montar

  return (
    <p className="numero-grande">
      <time dateTime={ahora.toISOString()}>{formatoHora.format(ahora)}</time>
    </p>
  );
}

export default function Ej06Reloj() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="ejercicio">
      <button type="button" onClick={() => setVisible((v) => !v)} aria-pressed={visible}>
        {visible ? "Desmontar reloj" : "Montar reloj"}
      </button>
      {visible && <Reloj />}
      <p className="nota">
        Abre la consola (F12): cada vez que desmontas aparece «intervalo limpiado». Al cargar la
        página, en desarrollo, salen un montaje, una limpieza y otro montaje seguidos: es el
        <code>StrictMode</code>, que monta dos veces a propósito para destapar efectos sin limpieza.
      </p>
    </div>
  );
}
