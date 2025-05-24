export interface PresupuestoData {
    monthly_budget: number;
    category_id: number;
}

export interface WarningData {
    categoria: string;
    presupuesto: number;
    gastoActual: number;
}

export interface IPresupuestoOperations {
    addPresupuesto: (data: PresupuestoData) => Promise<void>;
    deletePresupuesto: (id: number) => Promise<void>;
    updatePresupuesto: (id: number, data: PresupuestoData) => Promise<void>;
    getPresupuestos: () => Promise<PresupuestoTipo[]>;
}

export interface IPresupuestoWarning {
    checkWarning: () => Promise<WarningData | null>;
    dismissWarning: () => void;
}

export interface PresupuestoTipo {
    id: number;
    category_id: number;
    monthly_budget: number;
}

export interface CategoriaTipo {
    id: number;
    name: string;
} 