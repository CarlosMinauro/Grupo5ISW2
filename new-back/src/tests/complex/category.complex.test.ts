// Mocks para caja blanca
jest.mock('../../repositories/category.repository', () => ({
  CategoryRepository: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIds: jest.fn(),
    findByName: jest.fn(),
  })),
}));

// Pruebas de caja blanca (unitarias, con mocks)
describe('CategoryService - Caja blanca', () => {
  let service: any;
  let CategoryRepository: any;

  beforeAll(() => {
    jest.resetModules();
    
    // Importar los mocks
    CategoryRepository = require('../../repositories/category.repository').CategoryRepository;
    
    // Crear instancia del servicio
    service = require('../../services/category.service').CategoryService;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear una categoría correctamente', async () => {
    const mockCategoryData = {
      name: 'Nueva Categoría',
      description: 'Descripción de la nueva categoría'
    };

    const mockCreatedCategory = {
      id: 1,
      ...mockCategoryData
    };

    // Configurar mocks
    const mockCategoryRepositoryInstance = {
      findByName: jest.fn().mockResolvedValue(null), // Categoría no existe
      create: jest.fn().mockResolvedValue(mockCreatedCategory)
    };
    CategoryRepository.mockImplementation(() => mockCategoryRepositoryInstance);

    // Ejecutar test
    const categoryService = new service();
    // Reemplazar el repositorio con el mock
    (categoryService as any).categoryRepository = mockCategoryRepositoryInstance;
    
    const result = await categoryService.createCategory(mockCategoryData);

    // Verificar resultados
    expect(mockCategoryRepositoryInstance.findByName).toHaveBeenCalledWith('Nueva Categoría');
    expect(mockCategoryRepositoryInstance.create).toHaveBeenCalledWith(mockCategoryData);
    expect(result).toEqual(mockCreatedCategory);
  });

  it('debe lanzar error si la categoría ya existe al crear', async () => {
    const mockCategoryData = {
      name: 'Categoría Existente',
      description: 'Descripción de la categoría'
    };

    const existingCategory = {
      id: 1,
      name: 'Categoría Existente',
      description: 'Descripción existente'
    };

    // Configurar mocks
    const mockCategoryRepositoryInstance = {
      findByName: jest.fn().mockResolvedValue(existingCategory) // Categoría ya existe
    };
    CategoryRepository.mockImplementation(() => mockCategoryRepositoryInstance);

    // Ejecutar test
    const categoryService = new service();
    // Reemplazar el repositorio con el mock
    (categoryService as any).categoryRepository = mockCategoryRepositoryInstance;
    
    await expect(categoryService.createCategory(mockCategoryData)).rejects.toThrow('Category with this name already exists');
    expect(mockCategoryRepositoryInstance.findByName).toHaveBeenCalledWith('Categoría Existente');
  });

  it('debe obtener todas las categorías correctamente', async () => {
    const mockCategories = [
      {
        id: 1,
        name: 'Comida',
        description: 'Gastos en alimentación'
      },
      {
        id: 2,
        name: 'Transporte',
        description: 'Gastos en transporte'
      },
      {
        id: 3,
        name: 'Entretenimiento',
        description: 'Gastos en entretenimiento'
      }
    ];

    // Configurar mocks
    const mockCategoryRepositoryInstance = {
      findAll: jest.fn().mockResolvedValue(mockCategories)
    };
    CategoryRepository.mockImplementation(() => mockCategoryRepositoryInstance);

    // Ejecutar test
    const categoryService = new service();
    // Reemplazar el repositorio con el mock
    (categoryService as any).categoryRepository = mockCategoryRepositoryInstance;
    
    const result = await categoryService.getAllCategories();

    // Verificar resultados
    expect(mockCategoryRepositoryInstance.findAll).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
    expect(result).toHaveLength(3);
    expect(result[0].name).toBe('Comida');
    expect(result[1].name).toBe('Transporte');
    expect(result[2].name).toBe('Entretenimiento');
  });

  it('debe actualizar una categoría correctamente', async () => {
    const categoryId = 1;
    const mockUpdateData = {
      name: 'Categoría Actualizada',
      description: 'Nueva descripción'
    };

    const mockUpdatedCategory = {
      id: categoryId,
      ...mockUpdateData
    };

    // Configurar mocks
    const mockCategoryRepositoryInstance = {
      findByName: jest.fn().mockResolvedValue(null), // No hay conflicto de nombre
      update: jest.fn().mockResolvedValue(mockUpdatedCategory)
    };
    CategoryRepository.mockImplementation(() => mockCategoryRepositoryInstance);

    // Ejecutar test
    const categoryService = new service();
    // Reemplazar el repositorio con el mock
    (categoryService as any).categoryRepository = mockCategoryRepositoryInstance;
    
    const result = await categoryService.updateCategory(categoryId, mockUpdateData);

    // Verificar resultados
    expect(mockCategoryRepositoryInstance.findByName).toHaveBeenCalledWith('Categoría Actualizada');
    expect(mockCategoryRepositoryInstance.update).toHaveBeenCalledWith(categoryId, mockUpdateData);
    expect(result).toEqual(mockUpdatedCategory);
  });
}); 