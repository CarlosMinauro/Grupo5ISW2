/**
 * Configuración del Store de Redux
 * 
 * Este módulo implementa el store de Redux usando Redux Toolkit, siguiendo varios
 * patrones de diseño y principios SOLID:
 * 
 * 1. Patrón Observer: Redux implementa el patrón Observer donde los componentes
 *    se suscriben a cambios de estado y reaccionan en consecuencia.
 * 
 * 2. Principio de Responsabilidad Única (SRP): Cada slice gestiona su propio
 *    dominio del estado de la aplicación, con límites y responsabilidades claras.
 * 
 * 3. Principio de Segregación de Interfaces (ISP): El store está compuesto por
 *    múltiples slices, cada uno exponiendo solo el estado y las acciones
 *    relevantes para su dominio.
 * 
 * 4. Principio de Inversión de Dependencias (DIP): Los componentes dependen de
 *    la interfaz del store en lugar de implementaciones concretas, facilitando
 *    la modificación o reemplazo de la solución de gestión de estado.
 */

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import budgetReducer from './slices/budgetSlice';
import expenseReducer from './slices/expenseSlice';
import categoryReducer from './slices/categorySlice';

/**
 * Configura el store de Redux con todos los reducers
 * Cada reducer gestiona su propia porción del estado de la aplicación
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    budgets: budgetReducer,
    expenses: expenseReducer,
    categories: categoryReducer,
  },
});

/**
 * Definiciones de tipos para el estado del store y dispatch
 * Estos tipos permiten la seguridad de tipos al usar el store en componentes
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks tipados
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 