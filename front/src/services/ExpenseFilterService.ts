import { API_URL, ENDPOINTS } from '../config/api';

//Definir una interfaz para los filtros
interface ExpenseFilterParams {
    categoria?: string;
    fechaInicio?: string;
    fechaFin?: string;
    montoMin?: number;
    montoMax?: number;
}

export const getFilteredExpenses = async (filters: ExpenseFilterParams) => {
    try {
        const response = await fetch(ENDPOINTS.FILTER_EXPENSES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filters)
        });
        return response.data;
    } catch (error) {
        console.error("Error filtering expenses:", error);
        throw error;
    }
};
