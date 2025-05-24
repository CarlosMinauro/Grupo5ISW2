// src/config/api.ts

// URL base del backend
export const API_URL = 'http://localhost:5000';

// Endpoints
export const ENDPOINTS = {
    // Autenticación
    LOGIN: `${API_URL}/login`,
    REGISTER: `${API_URL}/register`,
    REGISTER_EMAIL: `${API_URL}/register/send-email`,
    RESET_PASSWORD: `${API_URL}/reset-password`,
    
    // Usuario
    PROFILE: `${API_URL}/perfil`,
    
    // Gastos
    EXPENSES: `${API_URL}/expenses`,
    ADD_EXPENSE: `${API_URL}/add-gasto`,
    
    // Presupuestos
    BUDGETS: `${API_URL}/budgets`,
    
    // Categorías
    CATEGORIES: `${API_URL}/categorias`,
    
    // Logs
    ACCESS_LOGS: `${API_URL}/accesslogs`,
    
    // Estadísticas
    USER_STATS: `${API_URL}/user-statistics`,
    MONTHLY_REPORTS: `${API_URL}/reports/monthly`,
    
    // Admin
    ADMIN_USERS: `${API_URL}/admin/users`,
    ADMIN_ROLES: `${API_URL}/admin/roles`,
    ADMIN_USER_ME: `${API_URL}/admin/users/me`,
    
    // Filtros
    FILTER_EXPENSES: `${API_URL}/filter-expenses`
}; 