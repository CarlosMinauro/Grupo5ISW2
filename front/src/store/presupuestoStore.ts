import { create } from 'zustand';
import { PresupuestoTipo } from '../types/PresupuestoTypes';
import { WarningData } from '../types/PresupuestoInterfaces';

/**
 * SRP (Principio de Responsabilidad Única):
 * Esta interfaz tiene una única responsabilidad: definir la estructura del estado
 * y los métodos para modificarlo. No mezcla lógica de negocio ni UI.
 */
interface PresupuestoState {
    // Estado
    presupuestos: PresupuestoTipo[];
    warningData: WarningData | null;
    selectedPresupuesto: PresupuestoTipo | null;
    modals: {
        delete: boolean;
        edit: boolean;
        add: boolean;
    };

    // Acciones
    setPresupuestos: (presupuestos: PresupuestoTipo[]) => void;
    setWarningData: (warning: WarningData | null) => void;
    setSelectedPresupuesto: (presupuesto: PresupuestoTipo | null) => void;
    setModalState: (modal: keyof PresupuestoState['modals'], isOpen: boolean) => void;
}

/**
 * ISP (Principio de Segregación de Interfaces):
 * El store expone solo los métodos necesarios para cada componente.
 * No fuerza a los componentes a implementar métodos que no necesitan.
 * 
 * DIP (Principio de Inversión de Dependencias):
 * Los componentes dependen de abstracciones (interfaces) en lugar de
 * implementaciones concretas.
 */
export const usePresupuestoStore = create<PresupuestoState>((set) => ({
    // Estado inicial
    presupuestos: [],
    warningData: null,
    selectedPresupuesto: null,
    modals: {
        delete: false,
        edit: false,
        add: false
    },

    // Acciones
    setPresupuestos: (presupuestos) => set({ presupuestos }),
    setWarningData: (warningData) => set({ warningData }),
    setSelectedPresupuesto: (selectedPresupuesto) => set({ selectedPresupuesto }),
    setModalState: (modal, isOpen) => set((state) => ({
        modals: { ...state.modals, [modal]: isOpen }
    }))
})); 