// src/services/CategoryService.ts
import { API_URL, ENDPOINTS } from '../config/api';

export interface CategoriaTipo {
  id: number;
  name: string;
}

export const fetchCategories = async () => {
    try {
        const response = await fetch(ENDPOINTS.CATEGORIES);
        const data = await response.json();
  return data.categorias || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
}
};
