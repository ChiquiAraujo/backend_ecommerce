document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const data = {
            email: email,
            password: password
        };

        console.log("Enviando solicitud POST a /api/sessions/login");
        
        fetch("/api/sessions/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Respuesta del servidor:", data);
            if (data.payload) {            
                if (data.payload.rol === 'admin') {
                    window.location.href = "/produc";  // Redirige al administrador
                } else if (data.payload.rol === 'user') {
                    window.location.href = "/productos";  // Redirige al usuario
                } else {
                    console.error("Rol desconocido:", data.payload.rol);
                }
            } else {
                console.error("Error en el inicio de sesión:", data.mensaje);
            }
        })        
        .catch((error) => {
            console.error("Error en el inicio de sesión:", error);
        });
    });
});