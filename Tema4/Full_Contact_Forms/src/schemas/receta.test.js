import { describe, expect, it } from "vitest";
import { esquemaReceta, MAX_MINUTOS_FACIL } from "./receta.js";

const valida = {
  nombre: "  Gazpacho andaluz  ",
  autor: "Leo",
  categoria: "Principal",
  dificultad: "fácil",
  raciones: 4,
  minutos: 20,
  vegana: true,
  ingredientes: [
    { nombre: "Tomate", cantidad: "1 kg" },
    { nombre: "Pepino", cantidad: "1" },
  ],
  pasos: "Tritura todo con aceite, vinagre y sal, cuela y deja enfriar en la nevera.",
};

// Los mensajes de un resultado de safeParse, indexados por ruta («ingredientes.1.nombre»)
function errores(resultado) {
  return Object.fromEntries(resultado.error.issues.map((problema) => [problema.path.join("."), problema.message]));
}

describe("esquemaReceta", () => {
  it("acepta una receta correcta y recorta los espacios", () => {
    const resultado = esquemaReceta.safeParse(valida);
    expect(resultado.success).toBe(true);
    expect(resultado.data.nombre).toBe("Gazpacho andaluz");
  });

  it("da mensajes propios en español", () => {
    const resultado = esquemaReceta.safeParse({ ...valida, nombre: " ", categoria: "", minutos: Number.NaN });
    expect(errores(resultado)).toMatchObject({
      nombre: "El nombre de la receta: al menos 3 caracteres",
      categoria: "Elige una categoría",
      minutos: "Escribe los minutos con números",
    });
  });

  it("marca el ingrediente repetido aunque cambien mayúsculas y tildes", () => {
    const ingredientes = [...valida.ingredientes, { nombre: "TOMATE", cantidad: "2" }];
    const resultado = esquemaReceta.safeParse({ ...valida, ingredientes });
    expect(errores(resultado)).toEqual({ "ingredientes.2.nombre": "«TOMATE» ya está en la lista" });
  });

  it("no deja una receta fácil de más de 45 minutos", () => {
    const resultado = esquemaReceta.safeParse({ ...valida, minutos: MAX_MINUTOS_FACIL + 1 });
    expect(Object.keys(errores(resultado))).toEqual(["minutos"]);
  });

  it("la regla de fácil salta aunque otro campo esté mal (when)", () => {
    const resultado = esquemaReceta.safeParse({ ...valida, autor: "", minutos: 90 });
    expect(Object.keys(errores(resultado)).toSorted()).toEqual(["autor", "minutos"]);
  });

  it("una receta vegana no puede llevar ingredientes animales", () => {
    const ingredientes = [...valida.ingredientes, { nombre: "Huevos camperos", cantidad: "2" }];
    const resultado = esquemaReceta.safeParse({ ...valida, ingredientes });
    expect(errores(resultado)["ingredientes.2.nombre"]).toMatch(/^Lleva huevo/);
  });

  it("si no es vegana, los ingredientes animales están permitidos", () => {
    const ingredientes = [...valida.ingredientes, { nombre: "Huevo duro", cantidad: "1" }];
    expect(esquemaReceta.safeParse({ ...valida, vegana: false, ingredientes }).success).toBe(true);
  });

  it("exige al menos dos ingredientes", () => {
    const resultado = esquemaReceta.safeParse({ ...valida, ingredientes: [valida.ingredientes[0]] });
    expect(errores(resultado).ingredientes).toBe("Una receta necesita al menos 2 ingredientes");
  });
});
