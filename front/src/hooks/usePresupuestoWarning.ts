import { useState, useCallback } from 'react';
import { fetchBudgets } from '../services/PresupuestoService';
import { fetchCategories } from '../services/CategoryService';
import { fetchExpenses } from '../services/GastoService';
import { WarningData } from '../types/PresupuestoTypes';
import { IPresupuestoWarning, WarningLevel, IPresupuestoValidator } from '../types/PresupuestoInterfaces';

class PresupuestoValidator implements IPresupuestoValidator {
    validateBudget(budget: number, expenses: number): boolean {
        return expenses < budget;
    }

    getWarningLevel(budget: number, expenses: number): WarningLevel {
        if (expenses >= budget) return WarningLevel.CRITICAL;
        if (expenses >= budget * 0.8) return WarningLevel.WARNING;
        return WarningLevel.NONE;
    }
}

export const usePresupuestoWarning = (): IPresupuestoWarning & { warningData: WarningData | null } => {
    const [warningData, setWarningData] = useState<WarningData | null>(null);
    const validator = new PresupuestoValidator();

    const checkWarning = useCallback(async (): Promise<WarningData | null> => {
        const presupuestosBD = await fetchBudgets();
        const categoriasActuales = await fetchCategories();
        const gastos = await fetchExpenses();

        for (const p of presupuestosBD) {
            const totalGasto = gastos
                .filter((g: { category_id: number; amount: number }) => g.category_id === p.category_id)
                .reduce((sum: number, g: { amount: number }) => sum + g.amount, 0);

            const warningLevel = validator.getWarningLevel(p.monthly_budget, totalGasto);
            
            if (warningLevel !== WarningLevel.NONE) {
                const cat = categoriasActuales.find((c: { id: number; name: string }) => c.id === p.category_id);
                const warning: WarningData = {
                    categoria: cat ? cat.name : String(p.category_id),
                    presupuesto: p.monthly_budget,
                    gastoActual: totalGasto
                };
                setWarningData(warning);
                return warning;
            }
        }
        
        setWarningData(null);
        return null;
    }, []);

    const dismissWarning = useCallback(() => {
        setWarningData(null);
    }, []);

    return {
        checkWarning,
        dismissWarning,
        warningData
    };
}; 