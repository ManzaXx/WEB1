// TanStack Query: claves y hooks de las recetas. Los componentes usan estos hooks, nunca useEffect + fetch.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { borrarReceta, crearReceta, listarRecetas } from "../services/recetas.js";

// Fábrica de claves jerárquicas: ["recetas"] ⊃ ["recetas", "lista"] ⊃ ["recetas", "lista", { categoria }].
// Así invalidar las listas refresca todos los filtros a la vez y nada más.
export const clavesRecetas = {
  todo: ["recetas"],
  listas: () => [...clavesRecetas.todo, "lista"],
  lista: (categoria) => [...clavesRecetas.listas(), { categoria }],
};

export function useRecetas(categoria) {
  return useQuery({
    queryKey: clavesRecetas.lista(categoria),
    queryFn: ({ signal }) => listarRecetas({ categoria, signal }),
  });
}

// Tras crear o borrar se invalidan las listas. Se devuelve la promesa de invalidateQueries:
// la mutación sigue «pendiente» hasta que la lista ya está actualizada, así el usuario no
// ve un «publicada» con la lista vieja debajo.
function useMutacionQueRefrescaListas(mutationFn) {
  const clienteQuery = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => clienteQuery.invalidateQueries({ queryKey: clavesRecetas.listas() }),
  });
}

export function useCrearReceta() {
  return useMutacionQueRefrescaListas(crearReceta);
}

export function useBorrarReceta() {
  return useMutacionQueRefrescaListas(borrarReceta);
}
