import request from 'supertest';
import { app } from '../app';
import { Expense, CreditCard, User, Role, Category } from '../models';

describe('Account Status Controller', () => {
  let testUser: any;
  let testRole: any;
  let testCategory: any;
  let authToken: string;
  const uniqueId = Date.now();

  beforeAll(async () => {
    // Limpiar todas las tablas relevantes para evitar duplicidad
    const { CreditCard, Expense, Category, User, Role } = require('../models');
    await Promise.all([
      CreditCard.destroy({ where: {} }),
      Expense.destroy({ where: {} }),
      Category.destroy({ where: {} }),
      User.destroy({ where: {} }),
      Role.destroy({ where: {} })
    ]);
    // Crear rol de prueba
    testRole = await Role.create({
      id: uniqueId,
      name: 'test-role-' + uniqueId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // Registrar usuario de prueba
    testUser = await request(app)
      .post('/api/auth/register')
      .send({
        email: `user${uniqueId}@example.com`,
        password: 'testpassword123',
        name: 'Test User',
        role_id: uniqueId
      });
    // Login para obtener token válido
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: `user${uniqueId}@example.com`, password: 'testpassword123' });
    authToken = loginResponse.body.token;
    if (!authToken) {
      throw new Error('No se pudo obtener un token válido. Respuesta: ' + JSON.stringify(loginResponse.body));
    }

    // Create test category
    testCategory = await Category.create({
      id: 9996,
      name: 'Test Category'
    });
  });

  afterAll(async () => {
    if (testUser && testUser.body && testUser.body.user) {
      await User.destroy({ where: { id: testUser.body.user.id } });
    }
    if (testRole) {
      await Role.destroy({ where: { id: testRole.id } });
    }
  });

  afterEach(async () => {
    if (testUser && testUser.body && testUser.body.user) {
      await Expense.destroy({ where: { user_id: testUser.body.user.id } });
      await CreditCard.destroy({ where: { user_id: testUser.body.user.id } });
    }
  });

  describe('GET /account-status/summary', () => {
    beforeEach(async () => {
      // Create test data for summary
      await Expense.create({
        id: 10001,
        user_id: testUser.id,
        date: new Date('2024-06-15'),
        amount: 250.00,
        description: 'Test Expense',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await CreditCard.create({
        id: 10001,
        user_id: testUser.id,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test data
      await Expense.destroy({ where: { user_id: testUser.id } });
      await CreditCard.destroy({ where: { user_id: testUser.id } });
    });

    it('should get account summary successfully', async () => {
      const response = await request(app)
        .get('/account-status/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('totalExpenses');
      expect(response.body.summary).toHaveProperty('totalBudgets');
      expect(response.body.summary).toHaveProperty('totalCreditLimit');
      expect(response.body.summary).toHaveProperty('availableCredit');
      expect(response.body.summary).toHaveProperty('budgetUtilization');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/account-status/summary')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /account-status/expenses', () => {
    beforeEach(async () => {
      // Create test expenses
      await Expense.create({
        id: 10001,
        user_id: testUser.id,
        date: new Date('2024-06-01'),
        amount: 100.00,
        description: 'Test Expense 1',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await Expense.create({
        id: 10002,
        user_id: testUser.id,
        date: new Date('2024-06-15'),
        amount: 200.00,
        description: 'Test Expense 2',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test expenses
      await Expense.destroy({ where: { user_id: testUser.id } });
    });

    it('should get expenses with pagination successfully', async () => {
      const response = await request(app)
        .get('/account-status/expenses?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('expenses');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.expenses)).toBe(true);
      expect(response.body.expenses.length).toBeGreaterThan(0);
      expect(response.body.pagination).toHaveProperty('currentPage', 1);
      expect(response.body.pagination).toHaveProperty('totalPages');
      expect(response.body.pagination).toHaveProperty('totalItems');
    });

    it('should get expenses with date filter successfully', async () => {
      const response = await request(app)
        .get('/account-status/expenses?startDate=2024-06-01&endDate=2024-06-30')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('expenses');
      expect(Array.isArray(response.body.expenses)).toBe(true);
    });

    it('should get expenses with category filter successfully', async () => {
      const response = await request(app)
        .get(`/account-status/expenses?categoryId=${testCategory.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('expenses');
      expect(Array.isArray(response.body.expenses)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/account-status/expenses')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /account-status/budgets', () => {
    beforeEach(async () => {
      // Create test budgets
      await Expense.create({
        id: 10001,
        user_id: testUser.id,
        date: new Date('2024-06-15'),
        amount: 300.00,
        description: 'Test Expense',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await CreditCard.create({
        id: 10001,
        user_id: testUser.id,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test data
      await Expense.destroy({ where: { user_id: testUser.id } });
      await CreditCard.destroy({ where: { user_id: testUser.id } });
    });

    it('should get budgets successfully', async () => {
      const response = await request(app)
        .get('/account-status/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('budgets');
      expect(Array.isArray(response.body.budgets)).toBe(true);
      expect(response.body.budgets.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/account-status/budgets')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /account-status/credit-cards', () => {
    beforeEach(async () => {
      // Create test credit cards
      await CreditCard.create({
        id: 10001,
        user_id: testUser.id,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank 1',
        bank: 'Test Bank',
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await CreditCard.create({
        id: 10002,
        user_id: testUser.id,
        card_number: '5555555555554444',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank 2',
        bank: 'Test Bank',
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test credit cards
      await CreditCard.destroy({ where: { user_id: testUser.id } });
    });

    it('should get credit cards successfully', async () => {
      const response = await request(app)
        .get('/account-status/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('creditCards');
      expect(Array.isArray(response.body.creditCards)).toBe(true);
      expect(response.body.creditCards.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/account-status/credit-cards')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /account-status/analytics', () => {
    beforeEach(async () => {
      // Create test data for analytics
      await Expense.create({
        id: 10001,
        user_id: testUser.id,
        date: new Date('2024-06-01'),
        amount: 150.00,
        description: 'Test Expense 1',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await Expense.create({
        id: 10002,
        user_id: testUser.id,
        date: new Date('2024-06-15'),
        amount: 250.00,
        description: 'Test Expense 2',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test data
      await Expense.destroy({ where: { user_id: testUser.id } });
    });

    it('should get analytics data successfully', async () => {
      const response = await request(app)
        .get('/account-status/analytics?period=month')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('analytics');
      expect(response.body.analytics).toHaveProperty('expenseTrends');
      expect(response.body.analytics).toHaveProperty('categoryBreakdown');
      expect(response.body.analytics).toHaveProperty('budgetUtilization');
    });

    it('should get analytics with custom date range', async () => {
      const response = await request(app)
        .get('/account-status/analytics?startDate=2024-06-01&endDate=2024-06-30')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('analytics');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/account-status/analytics')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

  });

  describe('GET /account-status/reports', () => {
    beforeEach(async () => {
      // Create test data for reports
      await Expense.create({
        id: 10001,
        user_id: testUser.id,
        date: new Date('2024-06-15'),
        amount: 300.00,
        description: 'Test Expense',
        recurring: false,
        category_id: testCategory.id,
        credit_card_id: null,
        transaction_type: 'expense',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test data
      await Expense.destroy({ where: { user_id: testUser.id } });
    });

    it('should generate monthly report successfully', async () => {
      const response = await request(app)
        .get('/account-status/reports?type=monthly&month=6&year=2024')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('report');
      expect(response.body.report).toHaveProperty('period');
      expect(response.body.report).toHaveProperty('summary');
      expect(response.body.report).toHaveProperty('expenses');
      expect(response.body.report).toHaveProperty('budgets');
    });

    it('should generate yearly report successfully', async () => {
      const response = await request(app)
        .get('/account-status/reports?type=yearly&year=2024')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('report');
      expect(response.body.report).toHaveProperty('period');
      expect(response.body.report).toHaveProperty('summary');
    });

    it('should return 400 for invalid report type', async () => {
      const response = await request(app)
        .get('/account-status/reports?type=invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/account-status/reports')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 