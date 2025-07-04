import { AuthService } from '../../services/auth.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock de los modelos
jest.mock('../../models/user.model');

const mockUserModel = require('../../models/user.model').default;

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let mockUser: any;

  beforeEach(() => {
    authService = new AuthService();
    
    // Mock de datos
    mockUser = {
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      name: 'Test User',
      role_id: 1
    };

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password_hash: 'password123',
        name: 'New User',
        role_id: 1
      };

      // Mock de bcrypt.hash
      (jest.spyOn(bcrypt, 'hash') as any).mockResolvedValue('hashedpassword');
      
      // Mock de User.create
      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        ...userData,
        password_hash: 'hashedpassword'
      });

      const result = await authService.register(userData);

      expect(result).toHaveProperty('email', userData.email);
      expect(result).toHaveProperty('name', userData.name);
      expect(result).toHaveProperty('role_id', userData.role_id);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password_hash, expect.any(String));
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password_hash: 'password123',
        name: 'Existing User',
        role_id: 1
      };

      // Mock de User.create para simular error de duplicado
      mockUserModel.create.mockRejectedValue(new Error('Duplicate email'));

      await expect(authService.register(userData)).rejects.toThrow('Duplicate email');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'testpassword123';

      // Mock de User.findOne
      mockUserModel.findOne.mockResolvedValue(mockUser);
      
      // Mock de bcrypt.compare
      (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(true);
      
      // Mock de jwt.sign
      (jest.spyOn(jwt, 'sign') as any).mockReturnValue('mock.jwt.token');

      const result = await authService.login(email, password);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', email);
      expect(result.token).toBe('mock.jwt.token');
      expect(mockUserModel.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { email }
      }));
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password_hash);
    });

    it('should throw error for invalid email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'testpassword123';

      // Mock de User.findOne para usuario no encontrado
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      // Mock de User.findOne
      mockUserModel.findOne.mockResolvedValue(mockUser);
      
      // Mock de bcrypt.compare para contraseña incorrecta
      (jest.spyOn(bcrypt, 'compare') as any).mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const token = 'valid.jwt.token';
      const decodedToken = { id: 1, email: 'test@example.com', role_id: 1 };

      // Mock de jwt.verify
      (jest.spyOn(jwt, 'verify') as any).mockReturnValue(decodedToken);
      
      // Mock de User.findByPk
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await authService.validateToken(token);

      expect(result).toHaveProperty('id', mockUser.id);
      expect(result).toHaveProperty('email', mockUser.email);
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(decodedToken.id);
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalid.jwt.token';

      // Mock de jwt.verify para token inválido
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken(token)).rejects.toThrow('Invalid token');
    });
  });
}); 