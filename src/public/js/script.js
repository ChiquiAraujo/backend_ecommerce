const socket = io('http://localhost:4000');

socket.emit('mensajeConexion', "Mensaje desde el cliente")