import request from 'supertest';
import { app } from '../app';
import { Role, User } from '../models';

describe('Expense API', () => {
  let authToken: string;
  let testCategoryId: number;
  let testUser: any;
  let testRole: any;
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
    // Crear categoría de prueba
    const categoryResponse = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Category for Expenses' });
    if (categoryResponse.status !== 201 || !categoryResponse.body.category) {
      throw new Error('No se pudo crear la categoría de prueba. Respuesta: ' + JSON.stringify(categoryResponse.body));
    }
    testCategoryId = categoryResponse.body.category.id;
  });

  afterAll(async () => {
    if (testUser && testUser.body && testUser.body.user) {
      await User.destroy({ where: { id: testUser.body.user.id } });
    }
    if (testRole) {
      await Role.destroy({ where: { id: testRole.id } });
    }
  });

  describe('GET /api/expenses', () => {
    it('should return all expenses for a user', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('expenses');
      expect(Array.isArray(response.body.expenses)).toBe(true);
    });

    it('should return expenses filtered by credit card', async () => {
      const response = await request(app)
        .get('/api/expenses?credit_card_id=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('expenses');
      expect(Array.isArray(response.body.expenses)).toBe(true);
    });
  });

  describe('POST /api/expenses', () => {
    it('should create a new expense', async () => {
      const newExpense = {
        amount: 100.50,
        description: 'Test Expense',
        date: new Date().toISOString(),
        category_id: testCategoryId,
        recurring: false,
        transaction_type: 'expense',
        credit_card_id: null
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newExpense);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('expense');
      expect(response.body.expense.amount).toBe(newExpense.amount);
      expect(response.body.expense.description).toBe(newExpense.description);
    });

    it('should validate required fields', async () => {
      const invalidExpense = {
        description: 'Test Expense'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidExpense);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 