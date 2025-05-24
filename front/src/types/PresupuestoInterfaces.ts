import { PresupuestoTipo, PresupuestoData, WarningData } from './PresupuestoTypes';

export enum WarningLevel {
    NONE = 'NONE',
    WARNING = 'WARNING',
    CRITICAL = 'CRITICAL'
}

export interface IPresupuestoValidator {
    validateBudget: (budget: number, expenses: number) => boolean;
    getWarningLevel: (budget: number, expenses: number) => WarningLevel;
}

export interface IPresupuestoCalculator {
    calculateTotalExpenses: (expenses: { amount: number }[]) => number;
    calculateRemainingBudget: (budget: number, expenses: number) => number;
}

export interface IPresupuestoEvents {
    onBudgetExceeded: (data: WarningData) => void;
    onBudgetUpdated: (data: PresupuestoData) => void;
    onBudgetDeleted: (id: number) => void;
}

export interface IPresupuestoService {
    getBudgets: () => Promise<PresupuestoTipo[]>;
    addBudget: (data: PresupuestoData) => Promise<void>;
    updateBudget: (id: number, data: PresupuestoData) => Promise<void>;
    deleteBudget: (id: number) => Promise<void>;
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