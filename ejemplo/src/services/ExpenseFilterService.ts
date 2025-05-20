import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL + "/filter-expenses";

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
        const response = await axios.get(`${API_URL}/filter-expenses`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error fetching filtered expenses:", error);
        return null;
    }
};
