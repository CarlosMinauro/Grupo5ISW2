import { useState, useCallback } from 'react';
import { fetchBudgets, crearPresupuesto } from '../services/PresupuestoService';
import { fetchCategories } from '../services/CategoryService';
import { fetchExpenses } from '../services/GastoService';
import { PresupuestoTipo, CategoriaTipo, PresupuestoData, WarningData } from '../types/PresupuestoTypes';

export const usePresupuestos = () => {
    const [lista, setLista] = useState<PresupuestoTipo[]>([]);
    const [categorias, setCategorias] = useState<CategoriaTipo[]>([]);
    const [showWarning, setShowWarning] = useState(false);
    const [warningData, setWarningData] = useState<WarningData | null>(null);

    const cargarPresupuestos = useCallback(async () => {
        const presupuestosBD = await fetchBudgets();
        setLista(presupuestosBD);
    }, []);

    const cargarCategorias = useCallback(async () => {
        const cats = await fetchCategories();
        setCategorias(cats);
    }, []);

    const updateWarning = useCallback(async () => {
        const presupuestosBD = await fetchBudgets();
        const categoriasActuales = await fetchCategories();
        const gastos = await fetchExpenses();

        setShowWarning(false);
        setWarningData(null);

        for (const p of presupuestosBD) {
            const totalGasto = gastos
                .filter((g: { category_id: number; amount: number }) => g.category_id === p.category_id)
                .reduce((sum: number, g: { amount: number }) => sum + g.amount, 0);

            if (totalGasto >= p.monthly_budget) {
                const cat = categoriasActuales.find((c: CategoriaTipo) => c.id === p.category_id);
                setWarningData({
                    categoria: cat ? cat.name : String(p.category_id),
                    presupuesto: p.monthly_budget,
                    gastoActual: totalGasto
                });
                setShowWarning(true);
                break;
            }
        }
    }, []);

    const addBudget = useCallback(async (budgetData: PresupuestoData) => {
        try {
            await crearPresupuesto(budgetData);
            await cargarPresupuestos();
            await cargarCategorias();
            await updateWarning();
        } catch (error) {
            console.error('Error adding budget:', error);
            throw error;
        }
    }, [cargarPresupuestos, cargarCategorias, updateWarning]);

    const getCategoryName = useCallback((catId: number): string => {
        const cat = categorias.find((c) => c.id === catId);
        return cat ? cat.name : String(catId);
    }, [categorias]);

    return {
        lista,
        categorias,
        showWarning,
        warningData,
        cargarPresupuestos,
        cargarCategorias,
        updateWarning,
        addBudget,
        getCategoryName,
        setShowWarning
    };
}; 