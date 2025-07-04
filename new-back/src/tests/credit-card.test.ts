import request from 'supertest';
import { app } from '../app';
import { User, Role, CreditCard } from '../models';

describe('Credit Card Controller', () => {
  let testUser: any;
  let testRole: any;
  const uniqueId = Date.now();
  let authToken: string;

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
        email: `credit${uniqueId}@example.com`,
        password: 'testpassword123',
        name: 'Test User',
        role_id: uniqueId
      });
    // Login para obtener token válido
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: `credit${uniqueId}@example.com`, password: 'testpassword123' });
    authToken = loginResponse.body.token;
    if (!authToken) {
      throw new Error('No se pudo obtener un token válido. Respuesta: ' + JSON.stringify(loginResponse.body));
    }
  });

  afterAll(async () => {
    // Limpiar solo si las variables están definidas
    if (testUser && testUser.body && testUser.body.user) {
      await User.destroy({ where: { id: testUser.body.user.id } });
    }
    if (testRole) {
      await Role.destroy({ where: { id: testRole.id } });
    }
  });

  describe('POST /credit-cards', () => {
    it('should create a new credit card successfully', async () => {
      const cardData = {
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id,
        is_active: true,
        created_at: new Date(),
        updatedAt: new Date()
      };

      const response = await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Credit card created successfully');
      expect(response.body).toHaveProperty('creditCard');
      expect(response.body.creditCard).toHaveProperty('card_holder_name', cardData.card_holder_name);
      expect(response.body.creditCard).toHaveProperty('brand', cardData.brand);
      expect(response.body.creditCard).toHaveProperty('user_id', testUser.id);
      // Card number should be masked
      expect(response.body.creditCard.card_number).not.toBe(cardData.card_number);
    });

    it('should return 400 for invalid card number', async () => {
      const cardData = {
        id: uniqueId,
        card_number: '1234', // Invalid card number
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id
      };

      const response = await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid expiration date format', async () => {
      const cardData = {
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: '25/12', // Wrong format
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id
      };

      const response = await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid brand', async () => {
      const cardData = {
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id
      };

      const response = await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for negative credit limit', async () => {
      const cardData = {
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id
      };

      const response = await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const cardData = {
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id
      };

      const response = await request(app)
        .post('/credit-cards')
        .send(cardData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /credit-cards', () => {
    it('should get all credit cards for the user successfully', async () => {
      // Create a test credit card first
      const cardData = {
        id: uniqueId,
        card_number: '5555555555554444',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank 2',
        bank: 'Test Bank 2',
        user_id: testUser.id
      };

      await request(app)
        .post('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .send(cardData);

      const response = await request(app)
        .get('/credit-cards')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('creditCards');
      expect(Array.isArray(response.body.creditCards)).toBe(true);
      expect(response.body.creditCards.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/credit-cards')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /credit-cards/:id', () => {
    let testCard: any;

    beforeEach(async () => {
      // Create a test credit card
      testCard = await CreditCard.create({
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id,
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test card
      if (testCard) {
        await CreditCard.destroy({ where: { id: testCard.id } });
      }
    });

    it('should get credit card by id successfully', async () => {
      const response = await request(app)
        .get(`/credit-cards/${testCard.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('creditCard');
      expect(response.body.creditCard).toHaveProperty('id', testCard.id);
      expect(response.body.creditCard).toHaveProperty('card_holder_name', testCard.card_holder_name);
      expect(response.body.creditCard).toHaveProperty('brand', testCard.brand);
      // Card number should be masked
      expect(response.body.creditCard.card_number).not.toBe(testCard.card_number);
    });

    it('should return 404 for non-existent credit card', async () => {
      const response = await request(app)
        .get('/credit-cards/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Credit card not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/credit-cards/${testCard.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /credit-cards/:id', () => {
    let testCard: any;

    beforeEach(async () => {
      // Create a test credit card
      testCard = await CreditCard.create({
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'Test User',
        expiration_date: new Date(),
        brand: 'Test Bank',
        bank: 'Test Bank',
        user_id: testUser.id,
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    afterEach(async () => {
      // Clean up test card
      if (testCard) {
        await CreditCard.destroy({ where: { id: testCard.id } });
      }
    });

    it('should update credit card successfully', async () => {
      const updateData = {
        card_holder_name: 'Updated User Name',
        brand: 'Updated Bank',
        bank: 'Updated Bank',
        user_id: testUser.id
      };

      const response = await request(app)
        .put(`/credit-cards/${testCard.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Credit card updated successfully');
      expect(response.body).toHaveProperty('creditCard');
      expect(response.body.creditCard).toHaveProperty('card_holder_name', updateData.card_holder_name);
      expect(response.body.creditCard).toHaveProperty('brand', updateData.brand);
      expect(response.body.creditCard).toHaveProperty('bank', updateData.bank);
      expect(response.body.creditCard).toHaveProperty('user_id', testUser.id);
    });

    it('should return 400 for invalid brand', async () => {
      const updateData = {
        brand: 'Updated Bank'
      };

      const response = await request(app)
        .put(`/credit-cards/${testCard.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent credit card', async () => {
      const updateData = {
        card_holder_name: 'Updated Name'
      };

      const response = await request(app)
        .put('/credit-cards/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Credit card not found');
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        card_holder_name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/credit-cards/${testCard.id}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /credit-cards/:id', () => {
    it('should delete credit card successfully', async () => {
      // Create a credit card to delete
      const cardToDelete = await CreditCard.create({
        id: uniqueId,
        card_number: '4111111111111111',
        card_holder_name: 'User to Delete',
        expiration_date: new Date(),
        brand: 'Delete Bank',
        bank: 'Delete Bank',
        user_id: testUser.id,
        is_active: true,
        created_at: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .delete(`/credit-cards/${cardToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Credit card deleted successfully');

      // Verify credit card was deleted
      const deletedCard = await CreditCard.findByPk(cardToDelete.id);
      expect(deletedCard).toBeNull();
    });

    it('should return 404 for non-existent credit card', async () => {
      const response = await request(app)
        .delete('/credit-cards/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Credit card not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/credit-cards/1')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 