const createMockProducts = (count = 100) => {
    const mockProducts = [];
    for (let i = 0; i < count; i++) {
      mockProducts.push({
        id: i,
        name: `Product ${i}`,
        description: `Description for product ${i}`,
        price: Math.random() * 100 // Random price for the product
      });
    }
    return mockProducts;
  };
  
  module.exports = {
    createMockProducts
  };
  