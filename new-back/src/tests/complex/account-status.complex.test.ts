// Mocks para caja blanca
jest.mock('../../models', () => ({
  Expense: { findAll: jest.fn() },
  Category: { findAll: jest.fn() },
}));

// Pruebas de caja blanca (unitarias, con mocks)
describe('AccountStatusService.getMonthlyStatus - Caja blanca', () => {
  let service: any;
  let Expense: any;

  beforeAll(() => {
    jest.resetModules();
    jest.doMock('../../models', () => ({
      Expense: { findAll: jest.fn() },
      Category: { findAll: jest.fn() },
    }));
    Expense = require('../../models').Expense;
    service = require('../../services/account-status.service').AccountStatusService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe lanzar error si el mes es inválido', async () => {
    await expect(service.getMonthlyStatus(0, 2024, 1, 1)).rejects.toThrow('Mes inválido');
    await expect(service.getMonthlyStatus(13, 2024, 1, 1)).rejects.toThrow('Mes inválido');
  });

  it('debe lanzar error si falta el ID de la tarjeta', async () => {
    await expect(service.getMonthlyStatus(6, 2024, 1, undefined as any)).rejects.toThrow('El ID de la tarjeta es requerido');
  });

  it('debe calcular correctamente los totales y agrupación por categoría', async () => {
    const mockExpenses = [
      { amount: 100, transaction_type: 'expense', Category: { id: 1, name: 'Comida' } },
      { amount: 50, transaction_type: 'expense', Category: { id: 2, name: 'Transporte' } },
      { amount: 30, transaction_type: 'payment', Category: { id: 1, name: 'Comida' } },
    ];
    Expense.findAll.mockResolvedValue(mockExpenses);
    const result = await service.getMonthlyStatus(6, 2024, 1, 1);
    expect(result.totalExpenses).toBe(150);
    expect(result.totalPaid).toBe(30);
    expect(result.expensesByCategory.length).toBe(2);
    expect(result.expensesByCategory.find((c: any) => c.categoryName === 'Comida')?.amount).toBe(130);
    expect(result.expensesByCategory.find((c: any) => c.categoryName === 'Transporte')?.amount).toBe(50);
    expect(result.balance).toBe(30 - 150);
  });

  it('debe calcular correctamente el balance cuando no hay pagos', async () => {
    const mockExpenses = [
      { amount: 100, transaction_type: 'expense', Category: { id: 1, name: 'Comida' } },
      { amount: 75, transaction_type: 'expense', Category: { id: 2, name: 'Transporte' } },
    ];
    Expense.findAll.mockResolvedValue(mockExpenses);
    const result = await service.getMonthlyStatus(6, 2024, 1, 1);
    expect(result.totalExpenses).toBe(175);
    expect(result.totalPaid).toBe(0);
    expect(result.balance).toBe(-175);
    expect(result.expensesByCategory.length).toBe(2);
  });
});

 