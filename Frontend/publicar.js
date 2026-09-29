document.getElementById('photos').addEventListener('change', function () {

    const nombre = this.files.length === 1
        ? this.files[0].name
        : `${this.files.length} archivos seleccionados`;

    document.getElementById('fileName').textContent =
        this.files.length ? nombre : '';
});


// ================================
// LEER IMAGEN
// ================================

function leerPrimeraFotoComoDataURL(inputFile) {

    return new Promise((resolve) => {

        const archivo = inputFile.files[0];

        if (!archivo) {
            resolve("");
            return;
        }

        const lector = new FileReader();

        lector.onload = () => resolve(lector.result);

        lector.readAsDataURL(archivo);
    });
}


// ================================
// PUBLICAR PRODUCTO
// ================================

document
    .getElementById('publishForm')
    .addEventListener('submit', async function (e) {

        e.preventDefault();


        const correoVendedor = document
            .getElementById('sellerEmail')
            .value
            .trim()
            .toLowerCase();


        const dominioValido =
            "@universitariadecolombia.edu.co";


        // Validar correo institucional

        if (!correoVendedor.endsWith(dominioValido)) {

            alert(
                `Solo se puede publicar con un correo ${dominioValido}`
            );

            return;
        }


        // Obtener datos del formulario

        const nombre =
            document.getElementById('title').value.trim();

        const categoria =
            document.getElementById('category').value;

        const precio = Number(
            document.getElementById('price').value);

        const estado =
            document.getElementById('condition').value;

        const descripcion =
            document.getElementById('description').value.trim();


        // Leer imagen
        try {

            const respuesta = await fetch('/api/producto', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    Nombre: nombre,

                    TipoCategoria: categoria,

                    Precio: precio,

                    Estado: estado,

                    Descripcion: descripcion,

                    CorreoVendedor: correoVendedor,

                    Imagen: document.getElementById('photos').files[0].name

                })

            });


            const datos = await respuesta.json();


            if (!respuesta.ok) {

                throw new Error(
                    datos.error || 'Error al publicar el producto'
                );

            }


            alert('¡Tu producto fue publicado correctamente!');


            window.location.href =
                `productos.html?categoria=${encodeURIComponent(categoria)}`;


        } catch (error) {

            console.error('Error:', error);

            alert(
                'No fue posible publicar el producto: ' +
                error.message
            );

        }

    });


// ================================
// MENÚ
// ================================

document
    .getElementById('menuToggle')
    .addEventListener('click', function () {

        document
            .getElementById('nav')
            .classList.toggle('open');

    });


// ================================
// HEADER
// ================================

window.addEventListener('scroll', function () {

    document
        .getElementById('header')
        .classList.toggle(
            'scrolled',
            window.scrollY > 40
        );

});