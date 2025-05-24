import { useMemo } from 'react';
import { GastoTipo } from '../types/GastoTipo';
import { useGastoStore } from '../store/gastoStore';

/**
 * SRP (Principio de Responsabilidad Única):
 * Este hook tiene una única responsabilidad: manejar el filtrado y ordenamiento
 * de gastos. No se mezcla con operaciones CRUD ni con UI.
 * 
 * DIP (Principio de Inversión de Dependencias):
 * - Depende del store como abstracción para el estado
 * - No depende de implementaciones concretas de filtrado
 */
export const useGastoFilters = () => {
    const { gastos, filtros, ordenamiento } = useGastoStore();

    /**
     * ISP (Principio de Segregación de Interfaces):
     * Esta función expone solo la funcionalidad necesaria para filtrar y ordenar.
     * No fuerza a los componentes a implementar lógica innecesaria.
     */
    const gastosFiltrados = useMemo(() => {
        let resultado = gastos.filter((gasto) => {
            // Filtro por categoría
            if (filtros.categoria && gasto.category_id.toString() !== filtros.categoria) {
                return false;
            }

            // Filtro por fecha
            if (filtros.fecha && gasto.date !== filtros.fecha) {
                return false;
            }

            // Filtro por monto mínimo
            if (filtros.minMonto !== null && gasto.amount < filtros.minMonto) {
                return false;
            }

            // Filtro por monto máximo
            if (filtros.maxMonto !== null && gasto.amount > filtros.maxMonto) {
                return false;
            }

            // Filtro por recurrencia
            if (filtros.recurrente === 'si' && !gasto.recurring) {
                return false;
            }
            if (filtros.recurrente === 'no' && gasto.recurring) {
                return false;
            }

            return true;
        });

        // Ordenamiento
        if (ordenamiento.columna && ordenamiento.direccion !== 'none') {
            resultado = [...resultado].sort((a, b) => {
                const valorA = a[ordenamiento.columna as keyof GastoTipo];
                const valorB = b[ordenamiento.columna as keyof GastoTipo];

                if (valorA === valorB) return 0;
                if (valorA === null) return 1;
                if (valorB === null) return -1;

                const comparacion = valorA < valorB ? -1 : 1;
                return ordenamiento.direccion === 'asc' ? comparacion : -comparacion;
            });
        }

        return resultado;
    }, [gastos, filtros, ordenamiento]);

    return {
        gastosFiltrados
    };
}; 