import fs from 'fs';
import path from 'path';

export class CartManager {
  constructor(relativePath) {
 // Aquí convertimos la ruta del módulo actual en una ruta absoluta
    const dirName = path.dirname(new URL(import.meta.url).pathname);
    this.path = path.join(dirName, relativePath);
    this.carts = [];  
    this.nextId = 1; 

    // Intenta cargar carrito desde el archivo al iniciar el manager
    this.initializeCartFile();

    try {
      const data = fs.readFileSync(this.path);
      this.carts = JSON.parse(data);
      this.nextId = this.getNextId();
    } catch (error) {
      console.error(`Error al leer el archivo ${this.path}: ${error}`);
    }
  }

  initializeCartFile() {
    const dir = path.dirname(this.path); 

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.path)) {
        try {
            fs.writeFileSync(this.path, JSON.stringify([]));
            console.log(`Archivo ${this.path} creado exitosamente.`);
        } catch (error) {
            console.error(`Error al crear el archivo ${this.path}: ${error}`);
        }
    }
  }

  getNextId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.carts.map(cart => cart.id));
    return maxId + 1;
  }


  // Guarda la lista actual de carrito en el archivo
  saveCarts() {
    try {
      const data = JSON.stringify(this.carts, null, 2);
      fs.writeFileSync(this.path, data);
    } catch (error) {
      console.error(`Error al escribir en el archivo ${this.path}: ${error}`);
    }
  }

  // Agrega un nuevo carrito vacío y lo guarda en el archivo
  addCart() {
    const newCart = {
      id: this.nextId++,
      products: []
    };

    this.carts.push(newCart);
    this.saveCarts();
  }

  // Busca un carrito por su ID
  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  // Agrega un producto al carrito identificado por cartId
  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      console.error(`No se encontró el carrito con id ${cartId}`);
      return;
    }

    const productInCart = cart.products.find(item => item.product === productId);
    if (productInCart) {
      // Si el producto ya está en el carrito, incrementa su cantidad
      productInCart.quantity++;
    } else {
      // Si el producto no está en el carrito, agrégalo
      cart.products.push({
        product: productId,
        quantity: 1
      });
    }
    this.saveCarts();
  }
}
// Ahora puedes crear una instancia de CartManager así:
const cartManager = new CartManager('../data/carrito.json');
