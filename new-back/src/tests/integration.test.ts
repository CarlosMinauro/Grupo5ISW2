import request from 'supertest';
import { app } from '../app';
import { User, Role, Category, Expense, CreditCard } from '../models';

describe('Integration Tests', () => {
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
        email: `integration${uniqueId}@example.com`,
        password: 'testpassword123',
        name: 'Integration Test User',
        role_id: uniqueId
      });
    // Login para obtener token válido
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: `integration${uniqueId}@example.com`, password: 'testpassword123' });
    authToken = loginResponse.body.token;
    if (!authToken) {
      throw new Error('No se pudo obtener un token válido. Respuesta: ' + JSON.stringify(loginResponse.body));
    }

    // Create test category
    testCategory = await Category.create({
      id: uniqueId,
      name: 'Integration Category ' + uniqueId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  afterAll(async () => {
    if (testUser && testUser.body && testUser.body.user) {
      await User.destroy({ where: { id: testUser.body.user.id } });
    }
    if (testRole) {
      await Role.destroy({ where: { id: testRole.id } });
    }
    // Clean up all test data
    await Expense.destroy({ where: { user_id: testUser.id } });
    await CreditCard.destroy({ where: { user_id: testUser.id } });
    await Category.destroy({ where: { id: testCategory.id } });
  });

  describe('Complete User Workflow', () => {
    it('should complete a full user workflow: create budget, add expenses, add credit card, check account status', async () => {
      // Step 1: Create a budget
      const budgetData = {
        name: 'Monthly Budget',
        amount: 2000.00,
        category_id: testCategory.id,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        description: 'Monthly budget for integration test'
      };

      const budgetResponse = await request(app)
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(budgetData)
        .expect(201);

      expect(budgetResponse.body).toHaveProperty('budget');
      const budgetId = budgetResponse.body.budget.id;

      // Step 2: Add expenses
      const expenseData1 = {
        description: 'Grocery shopping',
        amount: 150.00,
        category_id: testCategory.id,
        date: '2024-06-15'
      };

      const expenseResponse1 = await request(app)
        .post('/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData1)
        .expect(201);

      expect(expenseResponse1.body).toHaveProperty('expense');

      const expenseData2 = {
        description: 'Gas station',
        amount: 75.00,
        category_id: testCategory.id,
        date: '2024-06-16'
      };

      const expenseResponse2 = await request(app)
        .post('/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(expenseData2)
        .expect(201);

      expect(expenseResponse2.body).toHaveProperty('expense');

      // Step 3: Add credit card
      const creditCardData = {
        card_number: '4111111111111111',
        cardholder_name: 'Integration Test User',
        expiry_date: '12/25',
        cvv: '123',
        bank_name: 'Integration Bank',
        credit_limit: 5000.00,
        description: 'Credit card for integration test'
      };

      const creditCardResponse = await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(creditCardData)
        .expect(201);

      expect(creditCardResponse.body).toHaveProperty('creditCard');

      // Step 4: Check account status summary
      const summaryResponse = await request(app)
        .get('/account-status/summary')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(summaryResponse.body).toHaveProperty('summary');
      expect(summaryResponse.body.summary).toHaveProperty('totalExpenses');
      expect(summaryResponse.body.summary).toHaveProperty('totalBudgets');
      expect(summaryResponse.body.summary).toHaveProperty('totalCreditLimit');

      // Verify the summary data
      expect(summaryResponse.body.summary.totalExpenses).toBe(225.00); // 150 + 75
      expect(summaryResponse.body.summary.totalBudgets).toBe(2000.00);
      expect(summaryResponse.body.summary.totalCreditLimit).toBe(5000.00);

      // Step 5: Get expenses list
      const expensesResponse = await request(app)
        .get('/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(expensesResponse.body).toHaveProperty('expenses');
      expect(expensesResponse.body.expenses).toHaveLength(2);

      // Step 6: Get budgets list
      const budgetsResponse = await request(app)
        .get('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(budgetsResponse.body).toHaveProperty('budgets');
      expect(budgetsResponse.body.budgets).toHaveLength(1);

      // Step 7: Get credit cards list
      const creditCardsResponse = await request(app)
        .get('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(creditCardsResponse.body).toHaveProperty('creditCards');
      expect(creditCardsResponse.body.creditCards).toHaveLength(1);

      // Step 8: Update budget
      const updateBudgetData = {
        amount: 2500.00,
        description: 'Updated monthly budget'
      };

      const updateBudgetResponse = await request(app)
        .put(`/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateBudgetData)
        .expect(200);

      expect(updateBudgetResponse.body).toHaveProperty('budget');
      expect(updateBudgetResponse.body.budget).toHaveProperty('amount', 2500.00);

      // Step 9: Get analytics
      const analyticsResponse = await request(app)
        .get('/account-status/analytics?period=month')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(analyticsResponse.body).toHaveProperty('analytics');
      expect(analyticsResponse.body.analytics).toHaveProperty('expenseTrends');
      expect(analyticsResponse.body.analytics).toHaveProperty('categoryBreakdown');

      // Step 10: Generate report
      const reportResponse = await request(app)
        .get('/account-status/reports?type=monthly&month=6&year=2024')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(reportResponse.body).toHaveProperty('report');
      expect(reportResponse.body.report).toHaveProperty('period');
      expect(reportResponse.body.report).toHaveProperty('summary');
    });
  });

  describe('Data Consistency Tests', () => {
    it('should maintain data consistency across related operations', async () => {
      // Add multiple expenses
      const totalExpenses = await Expense.sum('amount', {
        where: { user_id: testUser.id }
      });

      expect(totalExpenses).toBe(600.00);

      // Verify budget utilization
      const budgetUtilization = (totalExpenses / 2000.00) * 100;
      expect(budgetUtilization).toBe(60.00);
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle concurrent operations gracefully', async () => {
      // Create multiple budgets simultaneously
      const budgetPromises = Array.from({ length: 5 }, (_, i) => 
        request(app)
          .post('/budgets')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Concurrent Budget ${i + 1}`,
            amount: 100.00 * (i + 1),
            category_id: testCategory.id,
            start_date: '2024-01-01',
            end_date: '2024-12-31'
          })
      );

      const responses = await Promise.all(budgetPromises);

      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('budget');
      });
    });

    it('should handle invalid data gracefully', async () => {
      // Try to create budget with invalid category
      const invalidBudgetResponse = await request(app)
        .post('/budgets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Invalid Budget',
          amount: 1000.00,
          category_id: 99999, // Non-existent category
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        })
        .expect(404);

      expect(invalidBudgetResponse.body).toHaveProperty('error', 'Category not found');

      // Try to create expense with negative amount
      const invalidExpenseResponse = await request(app)
        .post('/expenses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Invalid Expense',
          amount: -100.00,
          category_id: testCategory.id,
          date: '2024-06-15'
        })
        .expect(400);

      expect(invalidExpenseResponse.body).toHaveProperty('error');
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk operations efficiently', async () => {
      const startTime = Date.now();

      // Create multiple expenses in bulk
      const expensePromises = Array.from({ length: 10 }, (_, i) =>
        Expense.create({
          id: 10001 + i,
          description: `Bulk Expense ${i + 1}`,
          amount: 50.00,
          category_id: testCategory.id,
          user_id: testUser.id,
          date: new Date('2024-06-15'),
          recurring: false,
          transaction_type: 'expense',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      );

      await Promise.all(expensePromises);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(5000); // 5 seconds

      // Verify all expenses were created
      const expenseCount = await Expense.count({
        where: { user_id: testUser.id }
      });

      expect(expenseCount).toBeGreaterThanOrEqual(10);
    });
  });
}); 