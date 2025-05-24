import { useState, useCallback } from 'react';
import { fetchCategories } from '../services/CategoryService';
import { CategoriaTipo } from '../types/PresupuestoTypes';

export const usePresupuestoCategories = () => {
    const [categorias, setCategorias] = useState<CategoriaTipo[]>([]);

    const cargarCategorias = useCallback(async () => {
        const cats = await fetchCategories();
        setCategorias(cats);
        return cats;
    }, []);

    const getCategoryName = useCallback((catId: number): string => {
        const cat = categorias.find((c) => c.id === catId);
        return cat ? cat.name : String(catId);
    }, [categorias]);

    return {
        categorias,
        cargarCategorias,
        getCategoryName
    };
}; 