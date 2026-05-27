const ProductService = require('../src/productService');

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
};

describe('ProductService', () => {
  let service;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductService(mockRepo);
  });

  describe('getById()', () => {
    it('devuelve el producto cuando existe', async () => {
      mockRepo.findById.mockResolvedValue({
        id: 1,
        name: 'Laptop',
        price: 1200,
      });

      const result = await service.getById(1);

      expect(result.name).toBe('Laptop');
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
      expect(mockRepo.findById).toHaveBeenCalledTimes(1);
    });

    it('lanza error si el producto no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.getById(99))
        .rejects
        .toThrow('Producto 99 no encontrado.');
    });
  });

  describe('getByCategory()', () => {
    it('devuelve solo productos de la categoría indicada', async () => {
      mockRepo.findAll.mockResolvedValue([
        { id: 1, name: 'Laptop', category: 'tech' },
        { id: 2, name: 'Mouse', category: 'tech' },
        { id: 3, name: 'Silla', category: 'home' },
      ]);

      const result = await service.getByCategory('tech');

      expect(result).toHaveLength(2);
      expect(result.every(p => p.category === 'tech')).toBe(true);
    });

    it('devuelve array vacío si no hay productos', async () => {
      mockRepo.findAll.mockResolvedValue([
        { id: 1, name: 'Laptop', category: 'tech' },
      ]);

      const result = await service.getByCategory('sports');

      expect(result).toEqual([]);
    });
  });

  describe('searchByName()', () => {
    it('encuentra productos por nombre', async () => {
      mockRepo.findAll.mockResolvedValue([
        { id: 1, name: 'Laptop Gamer' },
        { id: 2, name: 'Mouse' },
      ]);

      const result = await service.searchByName('Laptop');

      expect(result).toHaveLength(1);
      expect(result[0].name).toContain('Laptop');
    });

    it('la búsqueda es case-insensitive', async () => {
      mockRepo.findAll.mockResolvedValue([
        { id: 1, name: 'Laptop Gamer' },
      ]);

      const result = await service.searchByName('lApToP');

      expect(result).toHaveLength(1);
    });

    it('lanza error si query está vacío', async () => {
      await expect(service.searchByName(''))
        .rejects
        .toThrow('La búsqueda no puede estar vacía.');
    });
  });

  describe('create()', () => {
    it('guarda un producto válido', async () => {
      const productData = {
        name: 'Teclado',
        price: 100,
      };

      mockRepo.save.mockResolvedValue({
        id: 1,
        ...productData,
      });

      const result = await service.create(productData);

      expect(result.id).toBe(1);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
      expect(mockRepo.save).toHaveBeenCalledWith(productData);
    });

    it('lanza error si el precio es negativo', async () => {
      await expect(
        service.create({
          name: 'Teclado',
          price: -50,
        })
      ).rejects.toThrow('El precio debe ser mayor a 0.');

      expect(mockRepo.save).not.toHaveBeenCalled();
    });

    it('lanza error si falta el nombre', async () => {
      await expect(
        service.create({
          price: 100,
        })
      ).rejects.toThrow('El nombre es obligatorio.');

      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });
});