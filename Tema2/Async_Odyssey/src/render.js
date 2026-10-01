const zona = document.querySelector("#resultado");

function crear(etiqueta, texto, clase) {
  const elemento = document.createElement(etiqueta);
  if (texto) elemento.textContent = texto;
  if (clase) elemento.className = clase;
  return elemento;
}

function mostrar(...nodos) {
  zona.replaceChildren(...nodos);
}

export const pintarCargando = () => mostrar(crear("p", "Cargando…", "estado"));

export const pintarVacio = (texto) => mostrar(crear("p", texto, "estado"));

export function pintarError(mensaje) {
  const aviso = crear("p", mensaje, "estado estado--error");
  aviso.setAttribute("role", "alert");
  mostrar(aviso);
}

function crearTarjeta({ id, nombre, imagen }) {
  const tarjeta = crear("button", "", "tarjeta");
  tarjeta.type = "button";
  tarjeta.dataset.id = id;

  const foto = document.createElement("img");
  foto.src = imagen;
  foto.alt = "";
  foto.loading = "lazy";

  tarjeta.append(foto, crear("span", nombre));
  return tarjeta;
}

export function pintarGrupos(grupos) {
  const secciones = Object.entries(grupos)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letra, recetas]) => {
      const seccion = crear("section", "", "grupo");
      const rejilla = crear("div", "", "rejilla");
      rejilla.append(...recetas.map(crearTarjeta));
      seccion.append(crear("h2", letra), rejilla);
      return seccion;
    });
  mostrar(...secciones);
}

export function pintarDetalle(receta) {
  const ficha = crear("article", "", "ficha");

  const volver = crear("button", "← Volver a la lista", "volver");
  volver.type = "button";

  const foto = document.createElement("img");
  foto.src = receta.imagen;
  foto.alt = receta.nombre;

  const ingredientes = crear("ul", "", "ingredientes");
  ingredientes.append(
    ...receta.ingredientes.map(({ ingrediente, medida }) =>
      crear("li", `${medida} ${ingrediente}`.trim()),
    ),
  );

  const pasos = crear("ol", "", "pasos");
  pasos.append(...receta.pasos.map((paso) => crear("li", paso)));

  ficha.append(
    volver,
    foto,
    crear("h2", receta.nombre),
    crear("p", [receta.categoria, receta.area].filter(Boolean).join(" · "), "meta"),
    crear("h3", "Ingredientes"),
    ingredientes,
    crear("h3", "Preparación"),
    pasos,
  );
  mostrar(ficha);
}
