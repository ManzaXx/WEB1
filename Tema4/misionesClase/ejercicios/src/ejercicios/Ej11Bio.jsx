// Ejercicio 11 · XSS: interpolar con JSX, dangerouslySetInnerHTML y DOMPurify
import DOMPurify from "dompurify";
import { useState } from "react";

// Texto "del usuario" con HTML malicioso dentro: la imagen no existe (src=x), falla al
// cargar y el atributo onerror ejecuta JavaScript
const BIO_DEL_USUARIO = 'Hola, soy <b>Pablo</b>. <img src=x onerror="alert(1)">';

// 1. Seguro: JSX escapa el texto. Las etiquetas se ven tal cual, como letras
function Bio({ texto }) {
  return <p className="bio">{texto}</p>;
}

// 2. Vulnerable: el navegador interpreta el HTML y el onerror se ejecuta (sale el alert)
function BioPeligrosa({ texto }) {
  return <p className="bio" dangerouslySetInnerHTML={{ __html: texto }} />;
}

// 3. Arreglada: DOMPurify quita lo peligroso (onerror, <script>…) y deja el HTML inofensivo (<b>)
function BioSaneada({ texto }) {
  const limpio = DOMPurify.sanitize(texto);
  return <p className="bio" dangerouslySetInnerHTML={{ __html: limpio }} />;
}

export default function Ej11Bio() {
  const [mostrarPeligrosa, setMostrarPeligrosa] = useState(false);

  return (
    <div className="ejercicio">
      <p>
        Texto recibido: <code>{BIO_DEL_USUARIO}</code>
      </p>

      <section>
        <h3>1 · Interpolado con JSX</h3>
        <Bio texto={BIO_DEL_USUARIO} />
        <p className="nota">Se pinta como texto inofensivo: React escapa <code>&lt;</code> y <code>&gt;</code>.</p>
      </section>

      <section>
        <h3>2 · Con dangerouslySetInnerHTML</h3>
        {mostrarPeligrosa ? (
          <BioPeligrosa texto={BIO_DEL_USUARIO} />
        ) : (
          <button type="button" className="peligro" onClick={() => setMostrarPeligrosa(true)}>
            Mostrar la variante vulnerable (saldrá un alert)
          </button>
        )}
        <p className="nota">La negrita funciona, pero también el <code>onerror</code>: ese código podría robar datos de la sesión.</p>
      </section>

      <section>
        <h3>3 · Saneado con DOMPurify</h3>
        <BioSaneada texto={BIO_DEL_USUARIO} />
        <p className="nota">
          Queda <code>{DOMPurify.sanitize(BIO_DEL_USUARIO)}</code>: la negrita se mantiene y el
          <code>onerror</code> ha desaparecido.
        </p>
      </section>
    </div>
  );
}
