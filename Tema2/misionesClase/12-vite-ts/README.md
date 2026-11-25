# Ejercicio 12 · Tu primer proyecto con Vite (Vanilla + TypeScript)

Proyecto creado tal cual con la plantilla oficial, sin tocar el código de ejemplo:

```bash
npm create vite@latest 12-vite-ts -- --template vanilla-ts
cd 12-vite-ts
npm install
npm run dev      # abre http://localhost:5173
```

## El `package.json`

Es la ficha del proyecto para npm. Lo importante:

- `"type": "module"`: los `.js` del proyecto usan módulos ES (`import`/`export`).
- `devDependencies`: `vite` (servidor de desarrollo y empaquetador) y `typescript` (el compilador `tsc`). Son de desarrollo porque el navegador no los necesita: al final solo recibe el JavaScript que generan.
- El `^` y el `~` de las versiones dicen qué actualizaciones acepta `npm install` (`^` acepta versiones *minor* y *patch* nuevas; `~`, solo *patch*). Las versiones exactas que se instalaron quedan apuntadas en `package-lock.json`, que **sí** se sube para que todo el mundo instale lo mismo.

## Scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Arranca el servidor de Vite con recarga en caliente (HMR): guardas un fichero y la página se actualiza sola. |
| `npm run build` | Primero `tsc` comprueba los tipos (si hay un error de tipos, se para); después `vite build` genera en `dist/` la versión optimizada para publicar. |
| `npm run preview` | Sirve la carpeta `dist/` para probar el resultado de la build tal como quedaría publicado. |

## Por qué `node_modules/` no se sube

- **Pesa mucho y se puede regenerar.** Aquí ocupa unos 67&nbsp;MB para dos dependencias. Con `package.json` y `package-lock.json` cualquiera lo reconstruye exacto con `npm install`.
- **Depende del sistema.** Algunos paquetes descargan binarios distintos para Windows, macOS o Linux; los míos no le servirían a otra persona.
- **Ensucia el repositorio.** Son miles de ficheros que nadie escribe a mano y que llenarían cada commit y cada revisión de cambios.

Por eso la plantilla ya trae un `.gitignore` con `node_modules` y `dist` (la carpeta de la build también se regenera con `npm run build`).
