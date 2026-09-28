let codigoActual = "";

function generarYMostrarCodigo() {
    codigoActual = String(
        Math.floor(100000 + Math.random() * 900000)
    );

    document.getElementById("codigoGenerado").textContent = codigoActual;
    document.getElementById("codigo").value = "";
}

generarYMostrarCodigo();

document
    .getElementById("regenerarCodigo")
    .addEventListener("click", generarYMostrarCodigo);


document
    .getElementById("formRegistro")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const nombre = document
            .getElementById("nombre")
            .value
            .trim();

        const correo = document
            .getElementById("correo")
            .value
            .trim()
            .toLowerCase();

        const codigoEscrito = document
            .getElementById("codigo")
            .value
            .trim();


        // Validar correo institucional
        if (!correo.endsWith("@universitariadecolombia.edu.co")) {
            alert(
                "Solo se puede registrar con un correo @universitariadecolombia.edu.co"
            );
            return;
        }


        // Validar código
        if (codigoEscrito !== codigoActual) {
            alert(
                "El código no coincide. Vuelve a escribirlo tal como aparece arriba."
            );

            generarYMostrarCodigo();
            return;
        }


        // Enviar datos al Backend
        try {

            const respuesta = await fetch("/api/usuario", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    Nombre: nombre,
                    CorreoInstitucional: correo,
                    CorreoVerificado: 1
                })
            });


            const datos = await respuesta.json();


            if (!respuesta.ok) {
                throw new Error(datos.error || "Error al registrar usuario");
            }


            alert("¡Cuenta creada correctamente!");

            window.location.href = "index.html";


        } catch (error) {

            console.error("Error:", error);

            alert(
                "No fue posible crear la cuenta: " + error.message
            );
        }
    });


// Menú
document
    .getElementById("menuToggle")
    .addEventListener("click", function () {

        document
            .getElementById("nav")
            .classList.toggle("open");

    });


// Header al hacer scroll
window.addEventListener("scroll", function () {

    document
        .getElementById("header")
        .classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

});