import request from 'supertest';
import { app } from '../app';
import { User, Role } from '../models';
import bcrypt from 'bcryptjs';

describe('User Controller', () => {
  let testUser: any;
  let testRole: any;
  const uniqueId = Date.now();
  let authToken: string;

  beforeAll(async () => {
    // Crear rol de prueba
    testRole = await Role.create({
      id: uniqueId,
      name: 'test-role-' + uniqueId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    testUser = await User.create({
      id: uniqueId,
      email: `user${uniqueId}@example.com`,
      password_hash: hashedPassword,
      name: 'Test User',
      role_id: testRole.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: `user${uniqueId}@example.com`,
        password: 'testpassword123'
      });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.destroy({ where: { id: testUser.id } });
    await Role.destroy({ where: { id: testRole.id } });
  });

  describe('GET /users', () => {
    it('should get all users successfully', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/users')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id', () => {
    it('should get user by id successfully', async () => {
      const response = await request(app)
        .get(`/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', testUser.id);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/users/${testUser.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Test User',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User updated successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('name', updateData.name);
      expect(response.body.user).toHaveProperty('email', updateData.email);
    });

    it('should return 400 for invalid email format', async () => {
      const updateData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put(`/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put(`/users/${testUser.id}`)
        .send(updateData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user successfully', async () => {
      // Create a user to delete
      const hashedPassword = await bcrypt.hash('deletepassword123', 10);
      const userToDelete = await User.create({
        id: 99999,
        email: 'delete@example.com',
        password_hash: hashedPassword,
        name: 'User to Delete',
        role_id: testRole.id
      });

      const response = await request(app)
        .delete(`/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'User deleted successfully');

      // Verify user was deleted
      const deletedUser = await User.findByPk(userToDelete.id);
      expect(deletedUser).toBeNull();
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/users/${testUser.id}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /users/profile', () => {
    it('should get current user profile successfully', async () => {
      const response = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', testUser.id);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty('name', testUser.name);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 