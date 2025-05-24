import { create } from 'zustand';
import { GastoTipo } from '../types/GastoTipo';
import { CategoriaTipo } from '../types/CategoriaTipo';

/**
 * SRP (Principio de Responsabilidad Única):
 * Esta interfaz tiene una única responsabilidad: definir la estructura del estado
 * y los métodos para modificarlo. No mezcla lógica de negocio ni UI.
 */
interface GastoState {
    // Estado
    gastos: GastoTipo[];
    categorias: CategoriaTipo[];
    selectedGasto: GastoTipo | null;
    modals: {
        delete: boolean;
        edit: boolean;
        add: boolean;
        export: boolean;
    };
    filtros: {
        categoria: string;
        fecha: string;
        minMonto: number | null;
        maxMonto: number | null;
        recurrente: string;
    };
    ordenamiento: {
        columna: string | null;
        direccion: 'asc' | 'desc' | 'none';
    };

    // Acciones
    setGastos: (gastos: GastoTipo[]) => void;
    setCategorias: (categorias: CategoriaTipo[]) => void;
    setSelectedGasto: (gasto: GastoTipo | null) => void;
    setModalState: (modal: keyof GastoState['modals'], isOpen: boolean) => void;
    setFiltro: (filtro: keyof GastoState['filtros'], valor: any) => void;
    setOrdenamiento: (columna: string | null, direccion: 'asc' | 'desc' | 'none') => void;
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
export const useGastoStore = create<GastoState>((set) => ({
    // Estado inicial
    gastos: [],
    categorias: [],
    selectedGasto: null,
    modals: {
        delete: false,
        edit: false,
        add: false,
        export: false
    },
    filtros: {
        categoria: '',
        fecha: '',
        minMonto: null,
        maxMonto: null,
        recurrente: ''
    },
    ordenamiento: {
        columna: null,
        direccion: 'none'
    },

    // Acciones
    setGastos: (gastos) => set({ gastos }),
    setCategorias: (categorias) => set({ categorias }),
    setSelectedGasto: (selectedGasto) => set({ selectedGasto }),
    setModalState: (modal, isOpen) => set((state) => ({
        modals: { ...state.modals, [modal]: isOpen }
    })),
    setFiltro: (filtro, valor) => set((state) => ({
        filtros: { ...state.filtros, [filtro]: valor }
    })),
    setOrdenamiento: (columna, direccion) => set({
        ordenamiento: { columna, direccion }
    })
})); 