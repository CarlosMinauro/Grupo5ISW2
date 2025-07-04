import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware';
import { AuthService } from '../../services/auth.service';

// Mock the AuthService
jest.mock('../../services/auth.service');

describe('AuthMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      // user: undefined
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
  });

  describe('authenticateToken', () => {
    it('should call next() when valid token is provided', async () => {
      const token = 'valid.jwt.token';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      mockAuthService.validateToken = jest.fn().mockResolvedValue(mockUser);

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockAuthService.validateToken).toHaveBeenCalledWith(token);
      expect((mockRequest as any).user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', async () => {
      mockRequest.headers = {};

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'No token provided'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token format is invalid', async () => {
      mockRequest.headers = {
        authorization: 'InvalidTokenFormat'
      };

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token format'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token validation fails', async () => {
      const token = 'invalid.jwt.token';

      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      mockAuthService.validateToken = jest.fn().mockRejectedValue(new Error('Invalid token'));

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockAuthService.validateToken).toHaveBeenCalledWith(token);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    beforeEach(() => {
      (mockRequest as any).user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: {
          id: 1,
          name: 'user',
          description: 'Regular user'
        }
      };
    });

    it('should call next() when user has required role', async () => {
      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', async () => {
      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', async () => {
      (mockRequest as any).user = undefined;

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user has no role', async () => {
      mockRequest.user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: null
      };

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAnyRole', () => {
    beforeEach(() => {
      mockRequest.user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: {
          id: 1,
          name: 'user',
          description: 'Regular user'
        }
      };
    });

    it('should call next() when user has one of the required roles', async () => {
      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user does not have any of the required roles', async () => {
      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Insufficient permissions'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', async () => {
      mockRequest.user = undefined;

      authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication required'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should call next() when valid token is provided', async () => {
      const token = 'valid.jwt.token';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      };

      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      mockAuthService.validateToken = jest.fn().mockResolvedValue(mockUser);

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockAuthService.validateToken).toHaveBeenCalledWith(token);
      expect((mockRequest as any).user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() when no token is provided', async () => {
      mockRequest.headers = {};

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect((mockRequest as any).user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() when token validation fails', async () => {
      const token = 'invalid.jwt.token';

      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      mockAuthService.validateToken = jest.fn().mockRejectedValue(new Error('Invalid token'));

      await authenticateToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockAuthService.validateToken).toHaveBeenCalledWith(token);
      expect((mockRequest as any).user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });
}); 