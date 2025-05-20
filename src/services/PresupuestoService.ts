import { PresupuestoTipo } from "../types/PresupuestoTipo";
import { API_URL, ENDPOINTS } from '../config/api';

// 1) Obtener todos los presupuestos
export const fetchBudgets = async () => {
    try {
        const userStr = sessionStorage.getItem("user");
        let token = "";
        if (userStr) {
            token = JSON.parse(userStr).token;
        }
        const response = await fetch(ENDPOINTS.BUDGETS, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        return data.presupuestos || [];
    } catch (error) {
        console.error('Error fetching budgets:', error);
        throw error;
    }
};

// 2) Crear presupuesto
export async function crearPresupuesto(nuevo: Partial<PresupuestoTipo>): Promise<void> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevo)
    });
}

// 3) Actualizar presupuesto
export async function actualizarPresupuesto(p: PresupuestoTipo): Promise<void> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    await fetch(`${API_URL}/${p.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(p)
    });
}

// 4) Eliminar presupuesto
export async function eliminarPresupuesto(id: number): Promise<void> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}