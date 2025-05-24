import { BudgetsTipo } from "../types/BudgetsTipo";
import { API_URL, ENDPOINTS } from '../config/api';

  export async function obtenerPresupuestos(): Promise<Pick<BudgetsTipo, 'monthly_budget' | 'category_id'>[]> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }

    const resp = await fetch(import.meta.env.VITE_API_URL + "/budgets", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await resp.json();

    // Devuelve un array vacío si no hay datos o si no es un array
    if (!Array.isArray(data.presupuestos) || data.length === 0) return [];

    return data.presupuestos.map((item: any) => ({
        monthly_budget: item.monthly_budget,
        category_id: item.category_id
    }));
}

export const fetchBudgets = async () => {
    try {
        const userStr = sessionStorage.getItem("user");
        let token = "";
        if (userStr) {
            token = JSON.parse(userStr).token;
        }

        const response = await fetch(ENDPOINTS.BUDGETS, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error al obtener presupuestos:", errorData);
            throw new Error(errorData.msg || "Error al obtener presupuestos");
        }

        const data = await response.json();
        return data.presupuestos || [];
    } catch (error) {
        console.error('Error fetching budgets:', error);
        throw error;
    }
};
