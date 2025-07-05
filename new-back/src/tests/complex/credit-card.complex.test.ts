// Mocks para caja blanca
jest.mock('../../models/credit-card.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock('../../models/expense.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

// Pruebas de caja blanca (unitarias, con mocks)
describe('CreditCardService - Caja blanca', () => {
  let service: any;
  let CreditCard: any;
  let Expense: any;

  beforeAll(() => {
    jest.resetModules();
    
    // Importar los mocks
    CreditCard = require('../../models/credit-card.model').default;
    Expense = require('../../models/expense.model').default;
    
    // Crear instancia del servicio
    service = require('../../services/credit-card.service').CreditCardService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear una tarjeta de crédito correctamente', async () => {
    const mockCardData = {
      user_id: 1,
      card_number: '4111111111111111',
      card_holder_name: 'Juan Pérez',
      expiration_date: '2025-12-31',
      brand: 'Visa',
      bank: 'Banco de Chile',
      is_active: true
    };

    const mockCreatedCard = {
      id: 1,
      ...mockCardData
    };

    // Configurar mocks
    CreditCard.create.mockResolvedValue(mockCreatedCard);

    // Ejecutar test
    const creditCardService = new service();
    const result = await creditCardService.createCard(mockCardData);

    // Verificar resultados
    expect(CreditCard.create).toHaveBeenCalledWith(mockCardData);
    expect(result).toEqual(mockCreatedCard);
    expect(result.card_number).toBe('4111111111111111');
    expect(result.brand).toBe('Visa');
    expect(result.is_active).toBe(true);
  });

  it('debe obtener tarjetas por usuario correctamente', async () => {
    const userId = 1;
    
    const mockCards = [
      {
        id: 1,
        user_id: userId,
        card_number: '4111111111111111',
        card_holder_name: 'Juan Pérez',
        expiration_date: '2025-12-31',
        brand: 'Visa',
        bank: 'Banco de Chile',
        is_active: true
      },
      {
        id: 2,
        user_id: userId,
        card_number: '5555555555554444',
        card_holder_name: 'Juan Pérez',
        expiration_date: '2026-06-30',
        brand: 'Mastercard',
        bank: 'Banco Santander',
        is_active: false
      }
    ];

    // Configurar mocks
    CreditCard.findAll.mockResolvedValue(mockCards);

    // Ejecutar test
    const creditCardService = new service();
    const result = await creditCardService.getCardsByUser(userId);

    // Verificar resultados
    expect(CreditCard.findAll).toHaveBeenCalledWith({ where: { user_id: userId } });
    expect(result).toEqual(mockCards);
    expect(result).toHaveLength(2);
    expect(result[0].brand).toBe('Visa');
    expect(result[1].brand).toBe('Mastercard');
  });

  it('debe actualizar una tarjeta correctamente', async () => {
    const cardId = 1;
    const mockUpdateData = {
      card_holder_name: 'Juan Carlos Pérez',
      is_active: false
    };

    const mockExistingCard = {
      id: cardId,
      user_id: 1,
      card_number: '4111111111111111',
      card_holder_name: 'Juan Pérez',
      expiration_date: '2025-12-31',
      brand: 'Visa',
      bank: 'Banco de Chile',
      is_active: true,
      update: jest.fn()
    };

    const mockUpdatedCard = {
      ...mockExistingCard,
      ...mockUpdateData
    };

    // Configurar mocks
    CreditCard.findByPk.mockResolvedValue(mockExistingCard);
    mockExistingCard.update.mockResolvedValue(mockUpdatedCard);

    // Ejecutar test
    const creditCardService = new service();
    const result = await creditCardService.updateCard(cardId, mockUpdateData);

    // Verificar resultados
    expect(CreditCard.findByPk).toHaveBeenCalledWith(cardId);
    expect(mockExistingCard.update).toHaveBeenCalledWith(mockUpdateData);
    expect(result).toEqual(mockUpdatedCard);
    expect(result.card_holder_name).toBe('Juan Carlos Pérez');
    expect(result.is_active).toBe(false);
  });

  it('debe obtener gastos próximos a vencer correctamente', async () => {
    const userId = 1;
    const cardId = 1;
    const fromDate = new Date('2024-06-01');
    const toDate = new Date('2024-06-30');
    
    const mockExpenses = [
      {
        id: 1,
        user_id: userId,
        credit_card_id: cardId,
        date: new Date('2024-06-15'),
        amount: 150.00,
        description: 'Gasto próximo a vencer 1',
        transaction_type: 'expense'
      },
      {
        id: 2,
        user_id: userId,
        credit_card_id: cardId,
        date: new Date('2024-06-20'),
        amount: 75.50,
        description: 'Gasto próximo a vencer 2',
        transaction_type: 'expense'
      }
    ];

    // Configurar mocks
    Expense.findAll.mockResolvedValue(mockExpenses);

    // Ejecutar test
    const creditCardService = new service();
    const result = await creditCardService.getExpensesDueSoon(userId, cardId, fromDate, toDate);

    // Verificar resultados
    expect(Expense.findAll).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        credit_card_id: cardId,
        date: {
          [require('sequelize').Op.between]: [fromDate, toDate],
        },
      },
    });
    expect(result).toEqual(mockExpenses);
    expect(result).toHaveLength(2);
    expect(result[0].amount).toBe(150.00);
    expect(result[1].amount).toBe(75.50);
  });
}); 