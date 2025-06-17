import request from 'supertest';
import app from '../app';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';

describe('Category API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });
    authToken = loginResponse.body.token;
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