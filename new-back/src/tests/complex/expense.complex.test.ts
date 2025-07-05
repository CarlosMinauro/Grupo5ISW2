// Mocks para caja blanca
jest.mock('../../repositories/expense.repository', () => ({
  ExpenseRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByUserId: jest.fn(),
    findByCategoryId: jest.fn(),
    findByDateRange: jest.fn(),
    getTotalExpensesByCategory: jest.fn(),
  })),
}));

// Pruebas de caja blanca (unitarias, con mocks)
describe('ExpenseService - Caja blanca', () => {
  let service: any;
  let ExpenseRepository: any;

  beforeAll(() => {
    jest.resetModules();
    
    // Importar los mocks
    ExpenseRepository = require('../../repositories/expense.repository').ExpenseRepository;
    
    // Crear instancia del servicio
    service = require('../../services/expense.service').ExpenseService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear un gasto correctamente', async () => {
    const mockExpenseData = {
      user_id: 1,
      date: new Date('2024-06-15'),
      amount: 100.50,
      description: 'Gasto de prueba',
      recurring: false,
      category_id: 1,
      credit_card_id: 1,
      transaction_type: 'expense'
    };

    const mockCreatedExpense = {
      id: 1,
      ...mockExpenseData
    };

    // Configurar mocks
    const mockExpenseRepositoryInstance = {
      create: jest.fn().mockResolvedValue(mockCreatedExpense)
    };
    ExpenseRepository.mockImplementation(() => mockExpenseRepositoryInstance);

    // Ejecutar test
    const expenseService = service.getInstance();
    // Reemplazar el repositorio con el mock
    (expenseService as any).expenseRepository = mockExpenseRepositoryInstance;
    
    const result = await expenseService.createExpense(mockExpenseData);

    // Verificar resultados
    expect(mockExpenseRepositoryInstance.create).toHaveBeenCalledWith(mockExpenseData);
    expect(result).toEqual(mockCreatedExpense);
  });

  it('debe lanzar error si falta el ID de la tarjeta al crear gasto', async () => {
    const mockExpenseData = {
      user_id: 1,
      date: new Date('2024-06-15'),
      amount: 100.50,
      description: 'Gasto de prueba',
      recurring: false,
      category_id: 1,
      transaction_type: 'expense'
      // credit_card_id faltante
    };

    // Ejecutar test
    const expenseService = service.getInstance();
    
    await expect(expenseService.createExpense(mockExpenseData)).rejects.toThrow('El ID de la tarjeta es requerido');
  });

  it('debe obtener gastos por usuario correctamente', async () => {
    const userId = 1;
    const creditCardId = 1;
    
    const mockExpenses = [
      {
        id: 1,
        user_id: userId,
        date: new Date('2024-06-15'),
        amount: 100.50,
        description: 'Gasto 1',
        recurring: false,
        category_id: 1,
        credit_card_id: creditCardId,
        transaction_type: 'expense'
      },
      {
        id: 2,
        user_id: userId,
        date: new Date('2024-06-16'),
        amount: 75.25,
        description: 'Gasto 2',
        recurring: false,
        category_id: 2,
        credit_card_id: creditCardId,
        transaction_type: 'expense'
      }
    ];

    // Configurar mocks
    const mockExpenseRepositoryInstance = {
      findByUserId: jest.fn().mockResolvedValue(mockExpenses)
    };
    ExpenseRepository.mockImplementation(() => mockExpenseRepositoryInstance);

    // Ejecutar test
    const expenseService = service.getInstance();
    // Reemplazar el repositorio con el mock
    (expenseService as any).expenseRepository = mockExpenseRepositoryInstance;
    
    const result = await expenseService.getExpensesByUser(userId, creditCardId);

    // Verificar resultados
    expect(mockExpenseRepositoryInstance.findByUserId).toHaveBeenCalledWith(userId, creditCardId);
    expect(result).toEqual(mockExpenses);
    expect(result).toHaveLength(2);
  });

  it('debe obtener totales por categoría correctamente', async () => {
    const userId = 1;
    const startDate = new Date('2024-06-01');
    const endDate = new Date('2024-06-30');
    
    const mockTotalsByCategory = [
      {
        category_id: 1,
        category_name: 'Comida',
        total_amount: 250.75,
        expense_count: 3
      },
      {
        category_id: 2,
        category_name: 'Transporte',
        total_amount: 120.50,
        expense_count: 2
      }
    ];

    // Configurar mocks
    const mockExpenseRepositoryInstance = {
      getTotalExpensesByCategory: jest.fn().mockResolvedValue(mockTotalsByCategory)
    };
    ExpenseRepository.mockImplementation(() => mockExpenseRepositoryInstance);

    // Ejecutar test
    const expenseService = service.getInstance();
    // Reemplazar el repositorio con el mock
    (expenseService as any).expenseRepository = mockExpenseRepositoryInstance;
    
    const result = await expenseService.getTotalExpensesByCategory(userId, startDate, endDate);

    // Verificar resultados
    expect(mockExpenseRepositoryInstance.getTotalExpensesByCategory).toHaveBeenCalledWith(userId, startDate, endDate);
    expect(result).toEqual(mockTotalsByCategory);
    expect(result).toHaveLength(2);
    expect(result[0].category_name).toBe('Comida');
    expect(result[0].total_amount).toBe(250.75);
    expect(result[1].category_name).toBe('Transporte');
    expect(result[1].total_amount).toBe(120.50);
  });
}); 