import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { z } from "zod";
import App from "./App.jsx";
import "./index.css";

// Un solo QueryClient para toda la app (ejercicio 08): es la caché compartida de las queries
const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // durante 30 s los datos se consideran frescos y no se vuelven a pedir
      // Reintentar sirve para fallos de red; si los datos no cumplen el esquema Zod (ejercicio 09)
      // fallarían igual, así que no se reintenta
      retry: (fallos, error) => !(error instanceof z.ZodError) && fallos < 2,
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
