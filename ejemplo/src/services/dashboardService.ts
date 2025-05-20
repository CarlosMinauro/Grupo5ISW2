// src/services/dashboardService.ts
export async function getGastosMensuales(): Promise<any[]> {
    const token = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string).token
      : "";
    const response = await fetch(import.meta.env.VITE_API_URL + "/reports/monthly", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return data.data || [];
  }
  

  export async function getGastosPorCategoria(): Promise<any[]> {
    const token = sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user") as string).token
      : "";
    const response = await fetch(import.meta.env.VITE_API_URL + "/reports/category", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    return data.data || [];
  }