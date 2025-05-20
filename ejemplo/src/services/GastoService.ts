// src/services/GastoService.ts
import { GastoTipo } from "../types/GastoTipo";

const API_URL = import.meta.env.VITE_API_URL + "/expenses";

// 1) Obtener todos los gastos
export async function obtenerGastos(): Promise<GastoTipo[]> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  const resp = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await resp.json();
  return data.gastos || [];
}

// 2) Crear gasto
export async function crearGasto(nuevo: Partial<GastoTipo>): Promise<void> {
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

// 3) Actualizar gasto
export async function actualizarGasto(g: GastoTipo): Promise<void> {
  const userStr = sessionStorage.getItem("user");
  let token = "";
  if (userStr) {
    token = JSON.parse(userStr).token;
  }
  await fetch(`${API_URL}/${g.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(g)
  });
}

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
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}