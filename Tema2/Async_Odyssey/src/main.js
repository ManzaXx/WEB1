import { buscarPorIngrediente, obtenerReceta } from "./api.js";
import { normalizarLista, agruparPorLetra, normalizarReceta } from "./logic.js";
import {
  pintarCargando,
  pintarError,
  pintarVacio,
  pintarGrupos,
  pintarDetalle,
} from "./render.js";

const formulario = document.querySelector("#formulario");
const entrada = document.querySelector("#ingrediente");
const resultado = document.querySelector("#resultado");

let ultimosGrupos = null;

async function buscar(ingrediente) {
  pintarCargando();
  try {
    const recetas = normalizarLista(await buscarPorIngrediente(ingrediente));
    if (recetas.length === 0) {
      ultimosGrupos = null;
      pintarVacio(`No hay recetas con «${ingrediente}». Prueba en inglés: chicken, egg, rice…`);
      return;
    }
    ultimosGrupos = agruparPorLetra(recetas);
    pintarGrupos(ultimosGrupos);
  } catch (error) {
    console.error(error);
    pintarError("No se pudieron cargar las recetas. Revisa tu conexión e inténtalo de nuevo.");
  }
}

async function mostrarDetalle(id) {
  pintarCargando();
  try {
    const cruda = await obtenerReceta(id);
    if (!cruda) {
      pintarVacio("Esa receta ya no existe.");
      return;
    }
    pintarDetalle(normalizarReceta(cruda));
  } catch (error) {
    console.error(error);
    pintarError("No se pudo cargar la receta. Revisa tu conexión e inténtalo de nuevo.");
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const ingrediente = entrada.value.trim();
  if (!ingrediente) {
    pintarVacio("Escribe un ingrediente para empezar.");
    return;
  }
  buscar(ingrediente);
});

resultado.addEventListener("click", (evento) => {
  const tarjeta = evento.target.closest(".tarjeta");
  if (tarjeta) {
    mostrarDetalle(tarjeta.dataset.id);
    return;
  }
  if (evento.target.closest(".volver") && ultimosGrupos) {
    pintarGrupos(ultimosGrupos);
  }
});
