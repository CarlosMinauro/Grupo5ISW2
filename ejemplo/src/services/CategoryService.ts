// src/services/CategoryService.ts
export interface CategoriaTipo {
  id: number;
  name: string;
}

export async function obtenerCategorias(): Promise<CategoriaTipo[]> {
  const resp = await fetch(import.meta.env.VITE_API_URL + "/categorias"); // Ajusta URL
  const data = await resp.json();
  return data.categorias || [];
}
