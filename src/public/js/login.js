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
            if (data.resultado === "Login valido") {
                // Asumiendo que el objeto de usuario devuelto tiene un campo 'rol'
                if (data.message.rol === 'admin') {
                    window.location.href = "/produc";  // Redirige al administrador
                } else if (data.message.rol === 'user') {
                    window.location.href = "/productos";  // Redirige al usuario regular
                } else {
                    console.error("Rol desconocido:", data.message.rol);
                }
            } else {
                console.error("Error en el inicio de sesión:", data.resultado);
            }
        })
        
        .catch((error) => {
            console.error("Error en el inicio de sesión:", error);
        });
    });
});

//
// document.addEventListener("DOMContentLoaded", function () {
//     const loginForm = document.getElementById("loginForm");

//     loginForm.addEventListener("submit", function (e) {
//         e.preventDefault();

//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const data = {
//             email: email,
//             password: password
//         };

//         console.log("Enviando solicitud POST a /api/sessions/login");
        
//         fetch("/api/sessions/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data),
//         })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("Respuesta del servidor:", data);
//             if (data.resultado === "Login valido") {
//                 window.location.href = "/productos";  
//             } else {
//                 console.error("Error en el inicio de sesión:", data.resultado);
//             }
//         })
//         .catch((error) => {
//             console.error("Error en el inicio de sesión:", error);
//         });
//     });
// });

//----------
// document.addEventListener("DOMContentLoaded", function () {
//     const loginForm = document.getElementById("loginForm");

//     loginForm.addEventListener("submit", function (e) {
//         e.preventDefault();

//         console.log("Enviando solicitud POST a /api/sessions/login");
//         const formData = new FormData(loginForm);
//         console.log("Datos del formulario:", formData);

//         console.log("Enviando solicitud POST a /api/sessions/login");

//         // Realizar una solicitud AJAX para enviar el formulario
//         console.log(formData);
//         fetch("/api/sessions/login", {
//             method: "POST",
//             body: formData,
//         })

//             .then((response) => response.json())
//             .then((data) => {
//                 console.log("Respuesta del servidor:", data);
//                 if (data.resultado === "Login valido") {
//                     // El usuario se ha autenticado correctamente
//                     if(data.message.rol === 'admin') {
//                         window.location.href = "/produc";  // Redirige al administrador
//                     } else {
//                         window.location.href = "/productos";  // Redirige al usuario regular
//                     }
//                 } else {
//                     // Mostrar un mensaje de error en caso de credenciales incorrectas
//                     console.error("Error en el inicio de sesión:", data.resultado);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Error en el inicio de sesión:", error);
//             });
//     });
// });
