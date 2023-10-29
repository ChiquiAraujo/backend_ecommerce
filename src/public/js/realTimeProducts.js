const socket = io();
const form = document.getElementById('idForm');
const botonProds = document.getElementById('botonProductos');
const botonLogout = document.getElementById('botonLogout'); // Nueva línea añadida
const productContainer = document.createElement('div');  // Div para contener la lista de productos

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datForm = new FormData(e.target);
    const prod = Object.fromEntries(datForm); 
    socket.emit('nuevoProducto', prod);
    e.target.reset();
});

botonProds.addEventListener('click', () => {
    socket.emit('getProds');  // Solicitamos al servidor la lista de productos
});

// Nueva sección añadida para el botón de logout
botonLogout.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:4000/api/sessions/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();

        if (response.status === 200 && data.resultado === 'Usuario deslogueado') {
            alert("Has cerrado sesión exitosamente.");
            window.location.href = "http://localhost:4000/login"; // Redirecciona al login después de cerrar sesión
        } else {
            alert(data.resultado);
        }

    } catch (error) {
        console.error('Error cerrando sesión:', error);
        alert("Error al intentar cerrar sesión.");
    }
});

socket.on('prods', (productos) => {
    // Limpiamos el contenedor de productos para no repetir la información
    productContainer.innerHTML = "";
    // Añadimos cada producto al contenedor
    productos.forEach(prod => {
        let prodDiv = document.createElement('div');
        prodDiv.innerHTML = `
            <h3>${prod.title}</h3>
            <p>Description: ${prod.description}</p>
            <p>Category: ${prod.category}<p>
            <p>Price: ${prod.price}</p>
            <p>Code: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
        `;
        productContainer.appendChild(prodDiv);
    });

    // Añadimos el contenedor de productos al body del documento
    document.body.appendChild(productContainer);
});
