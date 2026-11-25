// Operaciones sobre la lista de tareas que comparten los ejercicios 04 y 05.
// Todas devuelven un array NUEVO: nunca se modifica el que llega (React compara
// referencias, y si mutamos el mismo array no detecta el cambio).

export const TAREAS_INICIALES = [
  { id: 1, texto: "Repasar useState", hecha: true },
  { id: 2, texto: "Hacer el ejercicio de la lista", hecha: false },
  { id: 3, texto: "Leer «You Might Not Need an Effect»", hecha: false },
];

export function anadirTarea(tareas, texto) {
  // crypto.randomUUID da un id único y estable; el índice del array NO sirve como key
  // porque cambia al borrar una tarea
  return [...tareas, { id: crypto.randomUUID(), texto, hecha: false }];
}

export function alternarTarea(tareas, id) {
  return tareas.map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t));
}

export function borrarTarea(tareas, id) {
  return tareas.filter((t) => t.id !== id);
}
