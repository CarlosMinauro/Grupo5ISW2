// src/services/GastoService.ts
import { GastoTipo } from "../types/GastoTipo";
import { API_URL, ENDPOINTS } from '../config/api';

// 1) Obtener todos los gastos
export const fetchExpenses = async () => {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  try {
    const response = await fetch(ENDPOINTS.EXPENSES, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return data.gastos || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

// 2) Crear gasto
export async function crearGasto(nuevo: Partial<GastoTipo>): Promise<void> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  await fetch(ENDPOINTS.EXPENSES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(nuevo)
  });
}

// 3) Actualizar gasto
export const editExpense = async (expenseId: number, expenseData: any) => {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  try {
    const response = await fetch(`${ENDPOINTS.EXPENSES}/${expenseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(expenseData)
    });
    // ... existing code ...
  } catch (error) {
    console.error('Error editing expense:', error);
    throw error;
  }
};

//service para EditarGasto
export async function editGasto(g: GastoTipo): Promise<void> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  await fetch(import.meta.env.VITE_API_URL + "/edit-expenses/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(g)
  });
}

// 4) Eliminar gasto
export async function eliminarGasto(id: number): Promise<void> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  await fetch(`${ENDPOINTS.EXPENSES}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}