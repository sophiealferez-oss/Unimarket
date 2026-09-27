// Este archivo YA NO depende del array `productos` que venía en script.js
// (ese era el array de ejemplos fijos que querían quitar).
// Ahora lee lo que de verdad se ha publicado, usando productos-store.js.
// Por eso productos.html debe cargar productos-store.js ANTES que este archivo.

const parametros = new URLSearchParams(window.location.search);
const categoriaSeleccionada = parametros.get("categoria");

const tituloCategoria = document.getElementById("tituloCategoria");
const descripcionCategoria = document.getElementById("descripcionCategoria");
const productosGrid = document.getElementById("productosGrid");

let productosAMostrar;

if (categoriaSeleccionada) {
  tituloCategoria.textContent = categoriaSeleccionada;
  descripcionCategoria.textContent = `Productos y servicios publicados en "${categoriaSeleccionada}".`;
  productosAMostrar = obtenerProductosPorCategoria(categoriaSeleccionada);
} else {
  tituloCategoria.textContent = "Todos los productos";
  descripcionCategoria.textContent = "Explorando todo lo publicado por estudiantes.";
  productosAMostrar = obtenerProductos();
}

if (productosAMostrar.length === 0) {
  productosGrid.innerHTML = `<p class="blog__vacio">Todavía no hay productos publicados${categoriaSeleccionada ? ` en "${categoriaSeleccionada}"` : ""}. ¡Sé el primero en publicar uno!</p>`;
} else {
  productosAMostrar.forEach((producto) => {
    const precioFormateado = Number(producto.precio).toLocaleString("es-CO");

    const tarjeta = document.createElement("article");
    tarjeta.className = "post";
    tarjeta.innerHTML = `
      <div class="post__img" style="background-image: url('${producto.imagen}'); background-color: #b8c9c4;"></div>
      <div class="post__body">
        <div class="post__tags"><span class="tag">${producto.categoria}</span></div>
        <h3 class="post__title">${producto.nombre}</h3>
        <p class="post__date">$${precioFormateado}</p>
        <a href="producto.html?id=${producto.id}" class="btn btn--grad">Ver producto</a>
      </div>
    `;
    productosGrid.appendChild(tarjeta);
  });
}