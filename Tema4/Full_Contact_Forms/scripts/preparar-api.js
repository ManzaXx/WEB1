// Crea api/db.json a partir de la semilla la primera vez que se lanza `npm run api`.
// json-server escribe en db.json al publicar o borrar, así la semilla del repositorio no cambia.
// Para volver a empezar desde cero basta con borrar api/db.json.
import { copyFileSync, existsSync } from "node:fs";

const SEMILLA = new URL("../api/semilla.json", import.meta.url);
const BASE_DE_DATOS = new URL("../api/db.json", import.meta.url);

if (!existsSync(BASE_DE_DATOS)) {
  copyFileSync(SEMILLA, BASE_DE_DATOS);
  console.log("api/db.json creado desde api/semilla.json");
}
