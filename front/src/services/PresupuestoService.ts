import { PresupuestoTipo } from "../types/PresupuestoTipo";
import { API_URL, ENDPOINTS } from '../config/api';

// 1) Obtener todos los presupuestos
export const fetchBudgets = async () => {
    try {
        const userStr = sessionStorage.getItem("user");
        if (!userStr) {
            console.error("No hay usuario autenticado");
            return [];
        }

        const userInfo = JSON.parse(userStr);
        if (!userInfo.token) {
            console.error("No hay token de autenticación");
            return [];
        }

        const response = await fetch(ENDPOINTS.BUDGETS, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userInfo.token}`
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

// 2) Crear presupuesto
// Principio SRP: Este servicio solo se encarga de la creación de presupuestos
export async function crearPresupuesto(nuevo: Partial<PresupuestoTipo>): Promise<void> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    await fetch(ENDPOINTS.BUDGETS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevo)
    });
}

// 3) Actualizar presupuesto
// Principio SRP: Este servicio solo se encarga de la actualización de presupuestos
export async function actualizarPresupuesto(p: PresupuestoTipo): Promise<void> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    await fetch(`${ENDPOINTS.BUDGETS}/${p.id}` , {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(p)
    });
}

// 4) Eliminar presupuesto
// Principio SRP: Este servicio solo se encarga de la eliminación de presupuestos
export async function eliminarPresupuesto(id: number): Promise<void> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    await fetch(`${ENDPOINTS.BUDGETS}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}