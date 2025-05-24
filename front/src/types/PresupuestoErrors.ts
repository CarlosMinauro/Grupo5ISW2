/**
 * OCP (Principio Abierto/Cerrado):
 * Este enum está diseñado para ser extendido sin modificar el código existente.
 * Se pueden agregar nuevos tipos de errores sin afectar la implementación actual.
 */
export enum PresupuestoErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    BUSINESS_ERROR = 'BUSINESS_ERROR'
}

/**
 * LSP (Principio de Sustitución de Liskov):
 * Esta clase extiende Error manteniendo su contrato base.
 * Cualquier lugar que espere un Error puede usar PresupuestoError.
 * 
 * SRP (Principio de Responsabilidad Única):
 * Esta clase tiene una única responsabilidad: representar errores específicos
 * del módulo de presupuestos.
 */
export class PresupuestoError extends Error {
    constructor(
        public type: PresupuestoErrorType,
        public code: string,
        message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'PresupuestoError';
    }
}

/**
 * ISP (Principio de Segregación de Interfaces):
 * Esta función factory expone una interfaz simple para crear errores,
 * sin forzar al cliente a conocer los detalles de implementación.
 */
export const createPresupuestoError = (
    type: PresupuestoErrorType,
    code: string,
    message: string,
    details?: unknown
): PresupuestoError => {
    return new PresupuestoError(type, code, message, details);
}; 