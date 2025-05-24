import { useCallback } from 'react';
import { fetchBudgets, crearPresupuesto, actualizarPresupuesto, eliminarPresupuesto } from '../services/PresupuestoService';
import { PresupuestoTipo, PresupuestoData } from '../types/PresupuestoTypes';
import { IPresupuestoOperations } from '../types/PresupuestoInterfaces';
import { usePresupuestoStore } from '../store/presupuestoStore';
import { PresupuestoErrorType, createPresupuestoError } from '../types/PresupuestoErrors';

/**
 * SRP (Principio de Responsabilidad Única):
 * Este hook tiene una única responsabilidad: manejar las operaciones CRUD
 * de presupuestos. No se mezcla con UI ni con lógica de negocio compleja.
 * 
 * DIP (Principio de Inversión de Dependencias):
 * - Depende de abstracciones (IPresupuestoOperations) en lugar de implementaciones
 * - Usa el store como abstracción para el estado
 * - Los errores son manejados a través de abstracciones
 */
export const usePresupuestoOperations = (): IPresupuestoOperations => {
    const { setPresupuestos } = usePresupuestoStore();

    /**
     * ISP (Principio de Segregación de Interfaces):
     * Cada método expone solo la funcionalidad necesaria.
     * Los clientes no están forzados a implementar métodos que no usan.
     */
    const getPresupuestos = useCallback(async () => {
        try {
            const presupuestosBD = await fetchBudgets();
            setPresupuestos(presupuestosBD);
            return presupuestosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.NETWORK_ERROR,
                'FETCH_BUDGETS_ERROR',
                'Error al obtener presupuestos',
                error
            );
        }
    }, [setPresupuestos]);

    const addPresupuesto = useCallback(async (data: PresupuestoData) => {
        try {
            await crearPresupuesto(data);
            const presupuestosBD = await fetchBudgets();
            setPresupuestos(presupuestosBD);
            return presupuestosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.BUSINESS_ERROR,
                'ADD_BUDGET_ERROR',
                'Error al agregar presupuesto',
                error
            );
        }
    }, [setPresupuestos]);

    const updatePresupuesto = useCallback(async (id: number, data: PresupuestoData) => {
        try {
            await actualizarPresupuesto(id, data);
            const presupuestosBD = await fetchBudgets();
            setPresupuestos(presupuestosBD);
            return presupuestosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.BUSINESS_ERROR,
                'UPDATE_BUDGET_ERROR',
                'Error al actualizar presupuesto',
                error
            );
        }
    }, [setPresupuestos]);

    const deletePresupuesto = useCallback(async (id: number) => {
        try {
            await eliminarPresupuesto(id);
            const presupuestosBD = await fetchBudgets();
            setPresupuestos(presupuestosBD);
            return presupuestosBD;
        } catch (error) {
            throw createPresupuestoError(
                PresupuestoErrorType.BUSINESS_ERROR,
                'DELETE_BUDGET_ERROR',
                'Error al eliminar presupuesto',
                error
            );
        }
    }, [setPresupuestos]);

    return {
        getPresupuestos,
        addPresupuesto,
        updatePresupuesto,
        deletePresupuesto
    };
}; 