import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../services/auth.service';
import { User, Role } from '../../models';

// Mock the models
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  },
  Role: {
    findByPk: jest.fn()
  }
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn().mockResolvedValue('salt')
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockUser: any;
  let mockRole: any;

  beforeEach(() => {
    authService = new AuthService();
    
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock data
    mockRole = {
      id: 1,
      name: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUser = {
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashedPassword123',
      name: 'Test User',
      role_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: mockRole
    };
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role_id: 1
      };

      const hashedPassword = 'hashedPassword123';
      
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...userData,
        password: hashedPassword
      });
      (Role.findByPk as jest.Mock).mockResolvedValue(mockRole);

      const result = await authService.register(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('email', userData.email);
      expect(result).toHaveProperty('name', userData.name);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        role_id: 1
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.register(userData)).rejects.toThrow('User already exists');
    });

    it('should throw error if role does not exist', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role_id: 999
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (Role.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(authService.register(userData)).rejects.toThrow('Role not found');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const token = 'mock.jwt.token';

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.login(loginData.email, loginData.password);

      expect(User.findOne).toHaveBeenCalledWith({ 
        where: { email: loginData.email },
        include: [{ model: Role, as: 'role' }]
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password_hash);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, email: mockUser.email },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(result).toHaveProperty('token', token);
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData.email, loginData.password)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if user does not exist', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginData.email, loginData.password)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const token = 'valid.jwt.token';
      const decodedToken = { userId: 1, email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(User.findByPk).toHaveBeenCalledWith(decodedToken.userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalid.jwt.token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validateToken(token)).rejects.toThrow('Invalid token');
    });

    it('should throw error if user not found', async () => {
      const token = 'valid.jwt.token';
      const decodedToken = { userId: 999, email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(authService.validateToken(token)).rejects.toThrow('User not found');
    });
  });
}); 