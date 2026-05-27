class ProductService {
  constructor(productRepository) {
    this.repo = productRepository;
  }

  async getById(id) {
    const product = await this.repo.findById(id);

    if (!product) {
      throw new Error(`Producto ${id} no encontrado.`);
    }

    return product;
  }

  async getByCategory(category) {
    const products = await this.repo.findAll();

    return products.filter(
      product => product.category === category
    );
  }

  async searchByName(query) {
    if (!query || query.trim() === '') {
      throw new Error('La búsqueda no puede estar vacía.');
    }

    const products = await this.repo.findAll();

    return products.filter(product =>
      product.name
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }

  async create(productData) {
    if (!productData.name) {
      throw new Error('El nombre es obligatorio.');
    }

    if (
      productData.price === undefined ||
      productData.price <= 0
    ) {
      throw new Error('El precio debe ser mayor a 0.');
    }

    return await this.repo.save(productData);
  }
}

module.exports = ProductService;