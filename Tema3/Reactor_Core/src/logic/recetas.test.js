import { describe, expect, it } from "vitest";
import {
  agruparPorCoincidencias,
  combinarResultados,
  normalizar,
  normalizarIngredientes,
  normalizarLista,
  normalizarReceta,
  porcentajeCubierto,
  validarIngrediente,
} from "./recetas.js";

// Recetas crudas tal y como las devuelve filter.php
const POLLO = { idMeal: "1", strMeal: "Pollo al horno", strMealThumb: "pollo.jpg" };
const PAELLA = { idMeal: "2", strMeal: "Paella", strMealThumb: "paella.jpg" };
const RISOTTO = { idMeal: "3", strMeal: "Risotto", strMealThumb: "risotto.jpg" };

describe("normalizar", () => {
  it("ignora mayúsculas, espacios de sobra y guiones bajos", () => {
    expect(normalizar("  Chicken_Breast ")).toBe("chicken breast");
  });
});

describe("normalizarLista", () => {
  it("renombra los campos y descarta recetas sin id", () => {
    expect(normalizarLista([POLLO, { strMeal: "Sin id" }])).toEqual([
      { id: "1", nombre: "Pollo al horno", imagen: "pollo.jpg" },
    ]);
  });

  it("pone un nombre por defecto si viene vacío", () => {
    expect(normalizarLista([{ idMeal: "9", strMeal: "  " }])[0].nombre).toBe("Receta sin nombre");
  });
});

describe("combinarResultados", () => {
  const conPollo = normalizarLista([POLLO, PAELLA]);
  const conArroz = normalizarLista([PAELLA, RISOTTO]);

  it("junta las listas sin repetir recetas y apunta qué ingredientes usa cada una", () => {
    const recetas = combinarResultados([conPollo, conArroz], ["chicken", "rice"]);
    expect(recetas.map(({ id }) => id)).toEqual(["2", "1", "3"]);
    expect(recetas[0].coincidencias).toEqual(["chicken", "rice"]);
  });

  it("no modifica las listas que recibe", () => {
    const copia = structuredClone(conPollo);
    combinarResultados([conPollo, conArroz], ["chicken", "rice"]);
    expect(conPollo).toEqual(copia);
  });
});

describe("agruparPorCoincidencias", () => {
  it("agrupa de más a menos ingredientes usados", () => {
    const recetas = combinarResultados(
      [normalizarLista([POLLO, PAELLA]), normalizarLista([PAELLA])],
      ["chicken", "rice"],
    );
    const grupos = agruparPorCoincidencias(recetas);
    expect(grupos.map(({ cantidad }) => cantidad)).toEqual([2, 1]);
    expect(grupos[0].recetas[0].nombre).toBe("Paella");
  });
});

describe("normalizarReceta", () => {
  const cruda = {
    idMeal: "7",
    strMeal: "Tortilla",
    // desordenadas a propósito: el orden debe salir por el número del campo
    strIngredient2: "Butter",
    strMeasure2: "20g",
    strIngredient1: "Eggs",
    strMeasure1: "4",
    strIngredient3: "  ",
    strIngredient4: "Salt",
    strInstructions: "STEP 1\r\nBatir los huevos.\n\nCuajar.",
    strYoutube: "javascript:alert(1)",
  };

  it("ordena los ingredientes por su número y descarta los vacíos", () => {
    const { ingredientes } = normalizarReceta(cruda);
    expect(ingredientes.map(({ posicion, nombre }) => [posicion, nombre])).toEqual([
      [1, "Eggs"],
      [2, "Butter"],
      [4, "Salt"],
    ]);
  });

  it("marca lo que tienes y lo que puedes sustituir con tu nevera", () => {
    const [huevos, mantequilla, sal] = normalizarReceta(cruda, ["eggs", "Olive Oil"]).ingredientes;
    expect(huevos.enNevera).toBe(true);
    expect(mantequilla).toMatchObject({ enNevera: false, sustituto: "Olive Oil" });
    expect(sal).toMatchObject({ enNevera: false, sustituto: null, alternativa: null });
  });

  it("numera los pasos, quita los «STEP n» y no acepta enlaces que no sean https", () => {
    const receta = normalizarReceta(cruda);
    expect(receta.pasos).toEqual([
      { numero: 1, texto: "Batir los huevos." },
      { numero: 2, texto: "Cuajar." },
    ]);
    expect(receta.video).toBeNull();
  });
});

describe("porcentajeCubierto", () => {
  it("cuenta lo que tienes y los sustitutos", () => {
    const ingredientes = [
      { enNevera: true, sustituto: null },
      { enNevera: false, sustituto: "Lime" },
      { enNevera: false, sustituto: null },
    ];
    expect(porcentajeCubierto(ingredientes)).toBe(67);
  });

  it("devuelve 0 con una lista vacía en vez de dividir entre cero", () => {
    expect(porcentajeCubierto([])).toBe(0);
  });
});

describe("normalizarIngredientes", () => {
  it("quita vacíos y repetidos y ordena alfabéticamente", () => {
    const crudos = [{ strIngredient: "Rice" }, { strIngredient: "Eggs" }, { strIngredient: "Rice" }, {}];
    expect(normalizarIngredientes(crudos)).toEqual(["Eggs", "Rice"]);
  });
});

describe("validarIngrediente", () => {
  it("rechaza un texto vacío", () => {
    expect(validarIngrediente("   ", [])).toMatch(/Escribe/);
  });

  it("rechaza un repetido aunque cambien las mayúsculas", () => {
    expect(validarIngrediente("RICE", ["Rice"])).toMatch(/ya está/);
  });

  it("rechaza más de 5 ingredientes", () => {
    expect(validarIngrediente("Salt", ["a", "b", "c", "d", "e"])).toMatch(/como mucho 5/);
  });

  it("acepta un ingrediente nuevo", () => {
    expect(validarIngrediente("Salt", ["Rice"])).toBeNull();
  });
});
