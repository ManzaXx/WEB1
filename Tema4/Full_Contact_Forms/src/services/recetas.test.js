// Bonus: la respuesta del API se valida con Zod (safeParse) y el dato corrupto de la semilla se atrapa.
import { describe, expect, it } from "vitest";
import semilla from "../../api/semilla.json";
import { ErrorDatos } from "./http.js";
import { validarLista } from "./recetas.js";

describe("validarLista (respuesta del API)", () => {
  it("atrapa la receta corrupta de la semilla y deja pasar las otras cuatro", () => {
    const { recetas, descartadas } = validarLista(semilla.recetas);

    expect(recetas).toHaveLength(4);
    expect(descartadas).toHaveLength(1);
    expect(descartadas[0].id).toBe("5");
    // Cinco problemas distintos en el mismo registro, todos con su ruta
    expect(descartadas[0].problemas).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^autor:/),
        expect.stringMatching(/^categoria:/),
        expect.stringMatching(/^raciones:/),
        expect.stringMatching(/^ingredientes:/),
        expect.stringMatching(/^creada:/),
      ]),
    );
  });

  it("ordena las válidas de la más nueva a la más vieja", () => {
    const { recetas } = validarLista(semilla.recetas);
    expect(recetas.map((receta) => receta.id)).toEqual(["4", "3", "2", "1"]);
  });

  it("convierte los id numéricos en texto", () => {
    const { recetas } = validarLista([{ ...semilla.recetas[0], id: 7 }]);
    expect(recetas[0].id).toBe("7");
  });

  it("si la respuesta ni siquiera es una lista, lanza ErrorDatos", () => {
    expect(() => validarLista({ error: "no" })).toThrow(ErrorDatos);
  });
});
