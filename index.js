// Importamos los módulos necesarios para trabajar con archivos y rutas.
import fs from 'fs';

// Definimos la clase "ProductManager" que gestionará un conjunto de productos.
class ProductManager {
  constructor(path) {
    // Inicializamos las propiedades de la clase.
    // "path" representa la ruta del archivo donde se guardarán los productos en formato JSON.
    this.path = path;
    this.products = [];
    this.nextId = 1;

    // Intentamos leer los productos almacenados en el archivo y establecer el contador "nextId".
    try {
      const data = fs.readFileSync(this.path);
      this.products = JSON.parse(data);
      this.nextId = this.getNextId();
    } catch (error) {
      console.error(`Error al leer el archivo ${this.path}: ${error}`);
    }
  }

  // Método auxiliar para obtener el siguiente ID disponible para un nuevo producto.
  getNextId() {
    let maxId = 0;
    for (const product of this.products) {
      if (product.id > maxId) {
        maxId = product.id;
      }
    }
    return maxId + 1;
  }

  // Método para guardar los productos en el archivo.
  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.error(`Error al escribir en el archivo ${this.path}: ${error}`);
    }
  }

  // Método "addProduct" para agregar un nuevo producto a la lista de productos.
  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar que todos los campos sean obligatorios.
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Validar que no se repita el campo "code".
    const productExists = this.products.some(product => product.code === code);
    if (productExists) {
      console.error(`El producto con código ${code} ya existe`);
      return;
    }

    // Creamos un nuevo producto con un identificador único y los datos proporcionados.
    const newProduct = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    // Agregamos el nuevo producto a la lista de productos y guardamos los cambios en el archivo.
    this.products.push(newProduct);
    this.saveProducts(); 
    console.log("Producto añadido correctamente");
  }

  // Método "getProducts" para obtener la lista completa de productos.
  // Retorna un arreglo con todos los productos almacenados.
  getProducts() {
    return this.products;
  }

  // Método "getProductById" para buscar un producto por su ID.
  // Retorna el producto encontrado con el ID proporcionado o muestra un mensaje de error si no se encuentra.
  getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (!product) {
      console.error(`No se encontró el producto con id ${id}`);
    }
    return product;
  }

  // Método "updateProduct" para actualizar los datos de un producto por su ID.
  // Parámetros:
  // - id: El identificador único del producto que se quiere actualizar.
  // - updateData: Un objeto que contiene los campos y sus nuevos valores a actualizar.
  updateProduct(id, updateData) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      console.error(`No se encontró el producto con id ${id}`);
      return;
    }

    // Actualizamos los campos del producto con los nuevos valores proporcionados.
    const updatedProduct = { ...this.products[productIndex], ...updateData};
    this.products[productIndex] = updatedProduct;

    // Guardamos los cambios en el archivo.
    this.saveProducts();
    console.log(`Producto con id ${id} actualizado correctamente`);
  }

  // Método "deleteProduct" para eliminar un producto por su ID.
  deleteProduct(id) {
    const productIndex = this.products.findIndex(product => product.id === id);
    if (productIndex === -1) {
      console.error(`No se encontró el producto con id ${id}`);
      return;
    }

    // Eliminamos el producto del arreglo y guardamos los cambios en el archivo.
    this.products.splice(productIndex, 1);
    this.saveProducts();
    console.log(`Producto con id ${id} eliminado correctamente`);
  }
}

// Creamos una instancia de la clase "ProductManager" para gestionar los productos y especificamos el archivo donde
// se almacenarán los datos ("./productos.json").
const productManager = new ProductManager("./productos.json");

// Agregamos tres productos a la lista usando el método "addProduct".
productManager.addProduct(
  "iPhone 14",
  "128 GB, 5G, 6.7', Pantalla Super Retina XDR, Chip A16 Bionic, iOS",
  1599,
  "/path/to/thumbnail1.png",
  "p1",
  3
);

productManager.addProduct(
  "Samsung Galaxy S22",
  "5G, 128 GB, 8 GB RAM, 6.1'' FHD+, Exynos 2200, 3700 mAh, Android 12",
  1359,
  "/path/to/thumbnail1.png",
  "p2",
  5
);

productManager.addProduct(
  "Xiaomi 12T Pro",
  "256 GB, 12 GB, 6.67'', QHD, Snapdragon 8+ Gen 1, 5000 mAh, Android",
  849,
  "/path/to/thumbnail1.png",
  "p3",
  4
);

// Actualizando el stock de un producto (ID 8) mediante el método "updateProduct".
productManager.updateProduct(8, { stock: 8 });

// Finalmente, puedes utilizar el método "deleteProduct" para eliminar un producto por su ID (e.g., productManager.deleteProduct(3)).
// Como este método puede tener consecuencias, lo dejamos comentado para evitar la eliminación accidental de datos.
// productManager.deleteProduct(3);
