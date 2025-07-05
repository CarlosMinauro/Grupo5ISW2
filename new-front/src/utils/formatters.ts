/**
 * Funciones de utilidad para formatear datos
 * 
 * Este módulo implementa el Patrón Estrategia al proporcionar diferentes
 * estrategias de formateo para diferentes tipos de datos (moneda y fechas).
 * Cada formateador es una función separada que puede ser fácilmente intercambiada
 * o extendida sin modificar el código que la utiliza.
 * 
 * Las funciones siguen el Principio de Responsabilidad Única (SRP) al tener
 * una única responsabilidad de formateo cada una.
 * 
 * También soportan el Principio Abierto/Cerrado (OCP) ya que se pueden agregar
 * nuevas estrategias de formateo sin modificar el código existente.
 */

/**
 * Formatea un número como moneda usando el formato USD
 * @param amount - El número a formatear
 * @returns String con el formato de moneda
 * 
 * Ejemplo: formatCurrency(1234.56) => "$1,234.56"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Formatea una fecha en un formato corto consistente
 * @param date - La fecha a formatear (objeto Date o string)
 * @returns String con la fecha formateada
 * 
 * Ejemplo: formatDate(new Date()) => "1 ene. 2024"
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}; 