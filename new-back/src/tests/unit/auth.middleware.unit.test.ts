import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';

describe('Auth Middleware Unit Tests', () => {
  let mockRequest: Partial<Request> & { user?: any };
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      get: jest.fn()
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('should call next() when valid token is provided', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      };
      
      // Mock de jwt.verify para simular token válido
      (jest.spyOn(jwt, 'verify') as any).mockImplementation((_token: any, _secret: any, callback: any) => {
        callback(null, mockUser);
      });
      
      mockRequest.headers = {
        authorization: 'Bearer valid.jwt.token'
      };
      
      await authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jwt.verify).toHaveBeenCalledWith(
        'valid.jwt.token',
        process.env.JWT_SECRET || 'your-secret-key',
        expect.any(Function)
      );
      expect(mockRequest.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', async () => {
      await authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token format is invalid', async () => {
      mockRequest.headers = {
        authorization: 'InvalidTokenFormat'
      };
      await authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token validation fails', async () => {
      // Mock de jwt.verify para simular token inválido
      (jest.spyOn(jwt, 'verify') as any).mockImplementation((_token: any, _secret: any, callback: any) => {
        callback(new Error('Invalid token'), null);
      });
      
      mockRequest.headers = {
        authorization: 'Bearer invalid.jwt.token'
      };
      
      await authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(jwt.verify).toHaveBeenCalledWith(
        'invalid.jwt.token',
        process.env.JWT_SECRET || 'your-secret-key',
        expect.any(Function)
      );
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token inválido' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle token without Bearer prefix', async () => {
      mockRequest.headers = {
        authorization: 'valid.jwt.token'
      };
      await authenticateToken(mockRequest as Request, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Token no proporcionado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 