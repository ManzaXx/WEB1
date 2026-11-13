import { describe, expect, it } from "vitest";
import { formatearMinutos, ingredientesUsados, normalizar } from "./texto.js";
import { palabraAnimal } from "./vegano.js";

describe("normalizar", () => {
  it("quita tildes, mayúsculas y espacios de más", () => {
    expect(normalizar("  Pimentón   DULCE ")).toBe("pimenton dulce");
  });
});

describe("formatearMinutos", () => {
  it("pasa a horas solo cuando hace falta", () => {
    expect(formatearMinutos(40)).toBe("40 min");
    expect(formatearMinutos(60)).toBe("1 h");
    expect(formatearMinutos(75)).toBe("1 h 15 min");
  });
});

describe("palabraAnimal", () => {
  it("detecta ingredientes animales, también en plural o compuestos", () => {
    expect(palabraAnimal("Huevos")).toBe("huevo");
    expect(palabraAnimal("Muslos de pollo")).toBe("pollo");
    expect(palabraAnimal("Jamón serrano")).toBe("jamon");
  });

  it("no confunde las versiones vegetales", () => {
    expect(palabraAnimal("Leche de avena")).toBeNull();
    expect(palabraAnimal("Queso vegano")).toBeNull();
    expect(palabraAnimal("Tomate")).toBeNull();
  });
});

describe("ingredientesUsados", () => {
  it("junta los de todas las recetas sin repetir y en orden", () => {
    const recetas = [
      { ingredientes: [{ nombre: "Tomate" }, { nombre: "Ajo" }] },
      { ingredientes: [{ nombre: "tomate" }, { nombre: "Cebolla" }] },
    ];
    expect(ingredientesUsados(recetas)).toEqual(["Ajo", "Cebolla", "tomate"]);
  });
});
