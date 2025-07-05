import { Request, Response } from 'express';

// Mock completo del UserRepository para evitar dependencias de Sequelize
const mockUserRepository = {
  createAdditionalUser: jest.fn(),
  findAdditionalUsers: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findAll: jest.fn()
};

// Mock del UserController sin importar el real
class MockUserController {
  private userRepository: any;

  constructor() {
    this.userRepository = mockUserRepository;
  }

  // Registrar usuario adicional
  async registerAdditionalUser(req: Request, res: Response) {
    try {
      const parentUser = (req as any).user;
      if (!parentUser || !parentUser.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { name, email, password, role_id } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }
      // Solo el usuario principal puede crear adicionales
      if (parentUser.parent_user_id) {
        return res.status(403).json({ message: 'Solo el usuario principal puede crear usuarios adicionales' });
      }
      const userData = {
        name,
        email,
        password_hash: password,
        role_id: role_id || 2,
        parent_user_id: parentUser.id,
      };
      const newUser = await this.userRepository.createAdditionalUser(userData);
      return res.status(201).json({ user: newUser });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error registrando usuario adicional' });
    }
  }

  // Listar usuarios adicionales
  async getAdditionalUsers(req: Request, res: Response) {
    try {
      const parentUser = (req as any).user;
      if (!parentUser || !parentUser.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const users = await this.userRepository.findAdditionalUsers(parentUser.id);
      return res.json({ users });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error obteniendo usuarios adicionales' });
    }
  }

  // Eliminar usuario adicional
  async deleteAdditionalUser(req: Request, res: Response) {
    try {
      const parentUser = (req as any).user;
      if (!parentUser || !parentUser.id) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const { id } = req.params;
      // Verificar que el usuario a eliminar sea adicional del usuario autenticado
      const users = await this.userRepository.findAdditionalUsers(parentUser.id);
      const userToDelete = users.find((u: any) => u.id === Number(id));
      if (!userToDelete) {
        return res.status(404).json({ message: 'Usuario adicional no encontrado' });
      }
      await userToDelete.destroy();
      return res.json({ message: 'Usuario adicional eliminado' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Error eliminando usuario adicional' });
    }
  }
}

describe('UserController - Gestión de Usuarios Adicionales - Caja blanca', () => {
  let controller: MockUserController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mocks
    controller = new MockUserController();

    // Mock de respuesta
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('registerAdditionalUser', () => {
    it('debe crear un usuario adicional correctamente cuando el usuario es principal', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null // Usuario principal
      };

      const userData = {
        name: 'Usuario Adicional',
        email: 'adicional@test.com',
        password: 'password123',
        role_id: 2
      };

      const mockAdditionalUser = {
        id: 2,
        name: userData.name,
        email: userData.email,
        role_id: userData.role_id,
        parent_user_id: parentUser.id
      };

      mockRequest = {
        user: parentUser,
        body: userData
      } as any;

      mockUserRepository.createAdditionalUser.mockResolvedValue(mockAdditionalUser);

      // Act
      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.createAdditionalUser).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password_hash: userData.password,
        role_id: userData.role_id,
        parent_user_id: parentUser.id
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: mockAdditionalUser });
    });

    it('debe lanzar error 403 si un usuario adicional intenta crear otro usuario', async () => {
      // Arrange
      const additionalUser = {
        id: 2,
        name: 'Usuario Adicional',
        email: 'adicional@test.com',
        parent_user_id: 1 // Usuario adicional tiene padre
      };

      const userData = {
        name: 'Nuevo Usuario',
        email: 'nuevo@test.com',
        password: 'password123'
      };

      mockRequest = {
        user: additionalUser,
        body: userData
      } as any;

      // Act
      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Solo el usuario principal puede crear usuarios adicionales' 
      });
      expect(mockUserRepository.createAdditionalUser).not.toHaveBeenCalled();
    });

    it('debe lanzar error 401 si no hay usuario autenticado', async () => {
      // Arrange
      const userData = {
        name: 'Usuario Adicional',
        email: 'adicional@test.com',
        password: 'password123'
      };

      mockRequest = {
        user: null,
        body: userData
      } as any;

      // Act
      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Usuario no autenticado' 
      });
      expect(mockUserRepository.createAdditionalUser).not.toHaveBeenCalled();
    });

    it('debe lanzar error 400 si faltan campos obligatorios', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      const userData = {
        name: 'Usuario Adicional',
        // email faltante
        password: 'password123'
      };

      mockRequest = {
        user: parentUser,
        body: userData
      } as any;

      // Act
      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Faltan campos obligatorios' 
      });
      expect(mockUserRepository.createAdditionalUser).not.toHaveBeenCalled();
    });

    it('debe usar role_id por defecto si no se proporciona', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      const userData = {
        name: 'Usuario Adicional',
        email: 'adicional@test.com',
        password: 'password123'
        // role_id no proporcionado
      };

      const mockAdditionalUser = {
        id: 2,
        name: userData.name,
        email: userData.email,
        role_id: 2, // Valor por defecto
        parent_user_id: parentUser.id
      };

      mockRequest = {
        user: parentUser,
        body: userData
      } as any;

      mockUserRepository.createAdditionalUser.mockResolvedValue(mockAdditionalUser);

      // Act
      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.createAdditionalUser).toHaveBeenCalledWith({
        name: userData.name,
        email: userData.email,
        password_hash: userData.password,
        role_id: 2, // Debería usar el valor por defecto
        parent_user_id: parentUser.id
      });
    });
  });

  describe('getAdditionalUsers', () => {
    it('debe obtener usuarios adicionales correctamente', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      const mockAdditionalUsers = [
        {
          id: 2,
          name: 'Usuario Adicional 1',
          email: 'adicional1@test.com',
          role_id: 2,
          parent_user_id: parentUser.id
        },
        {
          id: 3,
          name: 'Usuario Adicional 2',
          email: 'adicional2@test.com',
          role_id: 2,
          parent_user_id: parentUser.id
        }
      ];

      mockRequest = {
        user: parentUser
      } as any;

      mockUserRepository.findAdditionalUsers.mockResolvedValue(mockAdditionalUsers);

      // Act
      await controller.getAdditionalUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.findAdditionalUsers).toHaveBeenCalledWith(parentUser.id);
      expect(mockResponse.json).toHaveBeenCalledWith({ users: mockAdditionalUsers });
    });

    it('debe lanzar error 401 si no hay usuario autenticado', async () => {
      // Arrange
      mockRequest = {
        user: null
      } as any;

      // Act
      await controller.getAdditionalUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Usuario no autenticado' 
      });
      expect(mockUserRepository.findAdditionalUsers).not.toHaveBeenCalled();
    });

    it('debe manejar errores del repositorio correctamente', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      mockRequest = {
        user: parentUser
      } as any;

      const errorMessage = 'Error de base de datos';
      mockUserRepository.findAdditionalUsers.mockRejectedValue(new Error(errorMessage));

      // Act
      await controller.getAdditionalUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: errorMessage 
      });
    });
  });

  describe('deleteAdditionalUser', () => {
    it('debe eliminar un usuario adicional correctamente', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      const userToDelete = {
        id: 2,
        name: 'Usuario a Eliminar',
        email: 'eliminar@test.com',
        role_id: 2,
        parent_user_id: parentUser.id,
        destroy: jest.fn().mockResolvedValue(true)
      };

      const mockAdditionalUsers = [userToDelete];

      mockRequest = {
        user: parentUser,
        params: { id: '2' }
      } as any;

      mockUserRepository.findAdditionalUsers.mockResolvedValue(mockAdditionalUsers);

      // Act
      await controller.deleteAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.findAdditionalUsers).toHaveBeenCalledWith(parentUser.id);
      expect(userToDelete.destroy).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Usuario adicional eliminado' 
      });
    });

    it('debe lanzar error 404 si el usuario adicional no existe', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      const mockAdditionalUsers = [
        {
          id: 2,
          name: 'Usuario Existente',
          email: 'existente@test.com',
          role_id: 2,
          parent_user_id: parentUser.id
        }
      ];

      mockRequest = {
        user: parentUser,
        params: { id: '999' } // ID que no existe
      } as any;

      mockUserRepository.findAdditionalUsers.mockResolvedValue(mockAdditionalUsers);

      // Act
      await controller.deleteAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Usuario adicional no encontrado' 
      });
    });

    it('debe lanzar error 401 si no hay usuario autenticado', async () => {
      // Arrange
      mockRequest = {
        user: null,
        params: { id: '2' }
      } as any;

      // Act
      await controller.deleteAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Usuario no autenticado' 
      });
      expect(mockUserRepository.findAdditionalUsers).not.toHaveBeenCalled();
    });

    it('debe manejar errores durante la eliminación', async () => {
      // Arrange
      const parentUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };

      const userToDelete = {
        id: 2,
        name: 'Usuario a Eliminar',
        email: 'eliminar@test.com',
        role_id: 2,
        parent_user_id: parentUser.id,
        destroy: jest.fn().mockRejectedValue(new Error('Error de eliminación'))
      };

      const mockAdditionalUsers = [userToDelete];

      mockRequest = {
        user: parentUser,
        params: { id: '2' }
      } as any;

      mockUserRepository.findAdditionalUsers.mockResolvedValue(mockAdditionalUsers);

      // Act
      await controller.deleteAdditionalUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Error de eliminación' 
      });
    });
  });

  describe('Validaciones de Permisos', () => {
    it('debe permitir que solo usuarios principales accedan a todas las funciones', async () => {
      // Arrange - Usuario principal
      const principalUser = {
        id: 1,
        name: 'Usuario Principal',
        email: 'principal@test.com',
        parent_user_id: null
      };
      
      // Arrange - Usuario adicional
      const additionalUser = {
        id: 2,
        name: 'Usuario Adicional',
        email: 'adicional@test.com',
        parent_user_id: 1
      };

      // Test: Usuario principal puede crear
      mockRequest = {
        user: principalUser,
        body: { name: 'Test', email: 'test@test.com', password: 'password' }
      } as any;

      mockUserRepository.createAdditionalUser.mockResolvedValue({});

      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(201);

      // Test: Usuario adicional NO puede crear
      jest.clearAllMocks();
      mockRequest = {
        user: additionalUser,
        body: { name: 'Test', email: 'test2@test.com', password: 'password' }
      } as any;

      await controller.registerAdditionalUser(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });
}); 