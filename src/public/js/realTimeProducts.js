const socket = io();
const form = document.getElementById('idForm');
const botonProds =document.getElementById('botonProductos')

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    console.log(e.target);
    const datForm = new FormData(e.target);
    console.log(datForm.get('title'));

    const prod = Object.fromEntries(datForm); //De un obj iterable se genera un obj simple
    console.log(prod);
    //Guardar el producto
    socket.emit('nuevoProducto', prod )
    e.target.reset();
})  ;

botonProds.addEventListener('click', ()=>{
    socket.on('prods', (productos)=>{
        console.log(productos)
    } )
})