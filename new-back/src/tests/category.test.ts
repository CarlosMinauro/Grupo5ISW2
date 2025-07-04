import request from 'supertest';
import { app } from '../app';
import { Role, User } from '../models';

describe('Category API', () => {
  let authToken: string;
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
  });

  afterAll(async () => {
    if (testUser && testUser.body && testUser.body.user) {
      await User.destroy({ where: { id: testUser.body.user.id } });
    }
    if (testRole) {
      await Role.destroy({ where: { id: testRole.id } });
    }
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/categories');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Test Category'
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('category');
      expect(response.body.category.name).toBe(newCategory.name);
    });

    it('should not create category with duplicate name', async () => {
      const newCategory = {
        name: 'Test Category'
      };

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newCategory);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 