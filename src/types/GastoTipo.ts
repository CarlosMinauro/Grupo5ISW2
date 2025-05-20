// src/types/GastoTipo.ts
export interface GastoTipo {
  id: number;
  date: string;         // p.ej "2025-01-15"
  amount: number;       // p.ej 2000
  description: string;  // OJO: unificamos a "description"
  recurring: boolean;
  category_id: number;  // p.ej 1,2,3...
  user_id?: number;     // opcional
}
