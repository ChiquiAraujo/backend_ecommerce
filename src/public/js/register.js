document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Obtener datos del formulario
        const formData = new FormData(registerForm);

        fetch("/api/users", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.respuesta === "OK") {
                    // El usuario se registró exitosamente,
                    window.location.href = "/login"; 
                } else {
                    // Mostrar un mensaje de error en caso de un problema en el registro
                    console.error("Error en el registro:", data.mensaje);
                }
            })
            .catch((error) => {
                console.error("Error en el registro:", error);
            });
    });
});