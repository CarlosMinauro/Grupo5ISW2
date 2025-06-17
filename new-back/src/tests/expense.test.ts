import request from 'supertest';
import app from '../app';

describe('Expense API', () => {
  let authToken: string;
  let testCategoryId: number;

  beforeAll(async () => {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });
    authToken = loginResponse.body.token;

    // Create a test category
    const categoryResponse = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Test Category for Expenses' });
    testCategoryId = categoryResponse.body.category.id;
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
        credit_card_id: 1
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