document.addEventListener('DOMContentLoaded', function() {
    const botonLogout = document.getElementById('botonLogout'); 

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
});
