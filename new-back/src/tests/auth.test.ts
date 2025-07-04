import request from 'supertest';
import { app } from '../app';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';
import { Role, User } from '../models';

describe('Auth Controller', () => {
  let testUser: any;
  let testRole: any;
  const uniqueId = Date.now();

  beforeAll(async () => {
    // Crear rol de prueba
    testRole = await Role.create({
      id: uniqueId,
      name: 'test-role-' + uniqueId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create test user
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    testUser = await User.create({
      id: uniqueId,
      email: `test${uniqueId}@example.com`,
      password_hash: hashedPassword,
      name: 'Test User',
      role_id: testRole.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.destroy({ where: { id: testUser.id } });
    await Role.destroy({ where: { id: testRole.id } });
  });

  beforeEach(async () => {
    // Clear any existing sessions
    await sequelize.query('DELETE FROM access_logs WHERE user_id = ?', {
      replacements: [testUser.id]
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        name: 'New User',
        role_id: testRole.id
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).toHaveProperty('name', userData.name);
      expect(response.body.user).not.toHaveProperty('password');

      // Clean up
      await User.destroy({ where: { email: userData.email } });
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        email: `test${uniqueId}@example.com`, // Already exists
        password: 'password123',
        name: 'Duplicate User',
        role_id: testRole.id
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email already exists');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Invalid User',
        role_id: testRole.id
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'weak@example.com',
        password: '123', // Too short
        name: 'Weak User',
        role_id: testRole.id
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: `test${uniqueId}@example.com`,
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', loginData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: `test${uniqueId}@example.com`,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 for missing email', async () => {
      const loginData = {
        password: 'testpassword123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        email: `test${uniqueId}@example.com`
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      // First login to get a token
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: `test${uniqueId}@example.com`,
          password: 'testpassword123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('error', 'No token provided');
    });
  });
}); 