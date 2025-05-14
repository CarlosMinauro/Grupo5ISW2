import { PresupuestoTipo } from "../types/PresupuestoTipo";

const API_URL = import.meta.env.VITE_API_URL + "/budgets"; // Ajusta tu puerto/URL

// 1) Obtener todos los presupuestos
export async function obtenerPresupuestos(): Promise<PresupuestoTipo[]> {
    const userStr = sessionStorage.getItem("user");
    let token = "";
    if (userStr) {
        token = JSON.parse(userStr).token;
    }
    const resp = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await resp.json();
    return data.presupuestos || [];
}

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