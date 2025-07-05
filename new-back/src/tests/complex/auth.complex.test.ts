// Mocks para caja blanca
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../../repositories/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  })),
}));

// Pruebas de caja blanca (unitarias, con mocks)
describe('AuthService - Caja blanca', () => {
  let service: any;
  let UserRepository: any;
  let bcrypt: any;
  let jwt: any;

  beforeAll(() => {
    jest.resetModules();
    
    // Importar los mocks
    UserRepository = require('../../repositories/user.repository').UserRepository;
    bcrypt = require('bcryptjs');
    jwt = require('jsonwebtoken');
    
    // Crear instancia del servicio
    service = require('../../services/auth.service').AuthService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe registrar un usuario correctamente', async () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'password123',
      role_id: 2
    };

    const mockUser = {
      id: 1,
      ...mockUserData,
      password_hash: 'hashedPassword123'
    };

    // Configurar mocks
    const mockUserRepositoryInstance = {
      findByEmail: jest.fn().mockResolvedValue(null), // Usuario no existe
      create: jest.fn().mockResolvedValue(mockUser)
    };
    UserRepository.mockImplementation(() => mockUserRepositoryInstance);
    
    bcrypt.genSalt.mockResolvedValue('salt123');
    bcrypt.hash.mockResolvedValue('hashedPassword123');

    // Ejecutar test
    const authService = new service();
    const result = await authService.register(mockUserData);

    // Verificar resultados
    expect(mockUserRepositoryInstance.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt123');
    expect(mockUserRepositoryInstance.create).toHaveBeenCalledWith({
      ...mockUserData,
      password_hash: 'hashedPassword123'
    });
    expect(result).toEqual(mockUser);
  });

  it('debe lanzar error si el usuario ya existe', async () => {
    const mockUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'password123',
      role_id: 2
    };

    const existingUser = {
      id: 1,
      name: 'Existing User',
      email: 'test@example.com',
      password_hash: 'hashedPassword123',
      role_id: 2
    };

    // Configurar mocks
    const mockUserRepositoryInstance = {
      findByEmail: jest.fn().mockResolvedValue(existingUser) // Usuario ya existe
    };
    UserRepository.mockImplementation(() => mockUserRepositoryInstance);

    // Ejecutar test
    const authService = new service();
    
    await expect(authService.register(mockUserData)).rejects.toThrow('User already exists');
    expect(mockUserRepositoryInstance.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('debe hacer login correctamente con credenciales válidas', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashedPassword123',
      role_id: 2
    };

    const mockToken = 'jwt-token-123';

    // Configurar mocks
    const mockUserRepositoryInstance = {
      findByEmail: jest.fn().mockResolvedValue(mockUser)
    };
    UserRepository.mockImplementation(() => mockUserRepositoryInstance);
    
    bcrypt.compare.mockResolvedValue(true); // Contraseña válida
    jwt.sign.mockReturnValue(mockToken);

    // Ejecutar test
    const authService = new service();
    const result = await authService.login(email, password);

    // Verificar resultados
    expect(mockUserRepositoryInstance.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password_hash);
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        email: mockUser.email,
        role_id: mockUser.role_id,
      },
      expect.any(String),
      { expiresIn: '24h' }
    );
    expect(result).toEqual({
      user: mockUser,
      token: mockToken
    });
  });

  it('debe validar token correctamente', async () => {
    const mockToken = 'valid-jwt-token';
    const mockDecodedToken = {
      id: 1,
      email: 'test@example.com',
      role_id: 2
    };
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashedPassword123',
      role_id: 2
    };

    // Configurar mocks
    const mockUserRepositoryInstance = {
      findById: jest.fn().mockResolvedValue(mockUser)
    };
    UserRepository.mockImplementation(() => mockUserRepositoryInstance);
    
    jwt.verify.mockReturnValue(mockDecodedToken);

    // Ejecutar test
    const authService = new service();
    const result = await authService.validateToken(mockToken);

    // Verificar resultados
    expect(jwt.verify).toHaveBeenCalledWith(
      mockToken,
      expect.any(String)
    );
    expect(mockUserRepositoryInstance.findById).toHaveBeenCalledWith(mockDecodedToken.id);
    expect(result).toEqual(mockUser);
  });
}); 