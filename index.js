// Definimos la clase "ProductManager" que gestionará un conjunto de productos.
class ProductManager {
    constructor() {
        // Inicializamos la lista de productos como un arreglo vacío.
        this.products = [];

        // Inicializamos el contador de IDs para asignar identificadores únicos a los productos.
        this.nextId = 1;
    }

    // Método "addProduct" para agregar un nuevo producto a la lista de productos.
    addProduct(title, description, price, thumbnail, code, stock) {
        // Validamos que todos los campos sean obligatorios.
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        // Validamos que no se repita el campo "code".
        const productExists = this.products.some(product => product.code === code);
        if (productExists) {
            console.error(`El código ${code} ya existe, introduzca uno nuevo`);
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

        // Agregamos el nuevo producto a la lista de productos.
        this.products.push(newProduct);
        console.log("Producto añadido correctamente");
    }

    // Método "getProducts" para obtener la lista completa de productos.
    getProducts() {
        return this.products;
    }

    // Método "getProductsByID" para buscar un producto por su ID.
    getProductsByID(id) {
        // Buscamos el producto en la lista de productos por su ID.
        const product = this.products.find(product => product.id === id);
        if (!product) {
            // Si no se encuentra el producto, mostramos un mensaje de error.
            console.error("Producto no encontrado");
        }
        return product;
    }
}

// Creamos una instancia de la clase "ProductManager".
const productManager = new ProductManager();

// Agregamos dos productos a la lista usando el método "addProduct".
productManager.addProduct(
    "iPhone 14",
    "128 GB, 5G, 6.7', Pantalla Super Retina XDR, Chip A16 Bionic, iOS",
    1599,
    "/path/to/thumbnail1.png",
    "p1",
    3
);

productManager.addProduct(
    "Samsung Galaxy S23",
    "5G, 128 GB, 8 GB RAM, 6.1'' FHD+, Exynos 2200, 3700 mAh, Android 12",
    1359,
    "/path/to/thumbnail1.png",
    "p2",
    5
);

// Obtenemos la lista completa de productos y la mostramos en la consola.
console.log(productManager.getProducts());

// Buscamos un producto por su ID (4) y lo mostramos en la consola.
const productById = productManager.getProductsByID(4);
console.log(productById);

// Intentamos buscar un producto con un ID inexistente (2) y mostramos el resultado en la consola.
const nonexistentProduct = productManager.getProductsByID(2);
console.log(nonexistentProduct);
