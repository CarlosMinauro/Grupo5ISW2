// src/services/dashboardService.ts
import { API_URL, ENDPOINTS } from '../config/api';

export const fetchMonthlyReports = async () => {
    try {
        const response = await fetch(ENDPOINTS.MONTHLY_REPORTS);
    const data = await response.json();
    return data.data || [];
    } catch (error) {
        console.error('Error fetching monthly reports:', error);
        throw error;
    }
};

export const fetchCategoryReports = async () => {
    try {
        const response = await fetch(`${ENDPOINTS.MONTHLY_REPORTS}/category`);
    const data = await response.json();
    return data.data || [];
    } catch (error) {
        console.error('Error fetching category reports:', error);
        throw error;
  }
};