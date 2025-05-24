import { useCallback } from 'react';
import { fetchExpenses, crearGasto, editGasto, eliminarGasto } from '../services/GastoService';
import { GastoTipo } from '../types/GastoTipo';
import { useGastoStore } from '../store/gastoStore';
import { PresupuestoErrorType, createPresupuestoError } from '../types/PresupuestoErrors';

/**
 * SRP (Principio de Responsabilidad Única):
 * Este hook tiene una única responsabilidad: manejar las operaciones CRUD
 * de gastos. No se mezcla con UI ni con lógica de negocio compleja.
 * 
 * DIP (Principio de Inversión de Dependencias):
 * - Depende de abstracciones (servicios) en lugar de implementaciones
 * - Usa el store como abstracción para el estado
 * - Los errores son manejados a través de abstracciones
 */
export const useGastoOperations = () => {
    const { setGastos } = useGastoStore();

    /**
     * ISP (Principio de Segregación de Interfaces):
     * Cada método expone solo la funcionalidad necesaria.
     * Los clientes no están forzados a implementar métodos que no usan.
     */
    const getGastos = useCallback(async () => {
        try {
            const gastosBD = await fetchExpenses();
            setGastos(gastosBD);
            return gastosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.NETWORK_ERROR,
                'FETCH_EXPENSES_ERROR',
                'Error al obtener gastos',
                error
            );
        }
    }, [setGastos]);

    const addGasto = useCallback(async (gastoData: Partial<GastoTipo>) => {
        try {
            await crearGasto(gastoData);
            const gastosBD = await fetchExpenses();
            setGastos(gastosBD);
            return gastosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.BUSINESS_ERROR,
                'ADD_EXPENSE_ERROR',
                'Error al agregar gasto',
                error
            );
        }
    }, [setGastos]);

    const updateGasto = useCallback(async (id: number, gastoData: Partial<GastoTipo>) => {
        try {
            await editGasto({ ...gastoData, id } as GastoTipo);
            const gastosBD = await fetchExpenses();
            setGastos(gastosBD);
            return gastosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.BUSINESS_ERROR,
                'UPDATE_EXPENSE_ERROR',
                'Error al actualizar gasto',
                error
            );
        }
    }, [setGastos]);

    const deleteGasto = useCallback(async (id: number) => {
        try {
            await eliminarGasto(id);
            const gastosBD = await fetchExpenses();
            setGastos(gastosBD);
            return gastosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.BUSINESS_ERROR,
                'DELETE_EXPENSE_ERROR',
                'Error al eliminar gasto',
                error
            );
        }
    }, [setGastos]);

    return {
        getGastos,
        addGasto,
        updateGasto,
        deleteGasto
    };
}; 