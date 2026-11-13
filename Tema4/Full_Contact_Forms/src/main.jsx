import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ErrorConfiguracion, ErrorDatos } from "./services/http.js";
import "./styles/base.css";
import "./styles/formulario.css";
import "./styles/listado.css";

const MEDIO_MINUTO_MS = 30_000;
const MAX_REINTENTOS = 2;

const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: {
      // Durante 30 s la lista se considera fresca: cambiar de filtro y volver no repite la petición
      staleTime: MEDIO_MINUTO_MS,
      // Reintentar sirve para la red, no para datos mal formados o una .env que falta: esos fallarían igual
      retry: (fallos, error) =>
        !(error instanceof ErrorDatos || error instanceof ErrorConfiguracion) && fallos < MAX_REINTENTOS,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={clienteQuery}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
