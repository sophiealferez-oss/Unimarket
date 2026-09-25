// Este archivo reutiliza el array `productos` que ya viene declarado en
// script.js (por eso productos.html carga script.js antes que este archivo).

const parametros = new URLSearchParams(window.location.search);
const categoriaSeleccionada = parametros.get("categoria");

const tituloCategoria = document.getElementById("tituloCategoria");
const descripcionCategoria = document.getElementById("descripcionCategoria");
const productosGrid = document.getElementById("productosGrid");

let productosAMostrar = productos;

if (categoriaSeleccionada) {
  tituloCategoria.textContent = categoriaSeleccionada;
  descripcionCategoria.textContent = `Productos y servicios publicados en "${categoriaSeleccionada}".`;
  productosAMostrar = productos.filter((p) =>
    p.etiquetas.some((t) => t.toLowerCase() === categoriaSeleccionada.toLowerCase())
  );
} else {
  tituloCategoria.textContent = "Todos los productos";
  descripcionCategoria.textContent = "Explorando todo lo publicado por estudiantes.";
}

if (productosAMostrar.length === 0) {
  productosGrid.innerHTML = `<p class="blog__vacio">Todavía no hay productos publicados en "${categoriaSeleccionada}". ¡Sé el primero en publicar uno!</p>`;
} else {
  productosAMostrar.forEach((producto) => {
    const tags = producto.etiquetas.map((t) => `<span class="tag">${t}</span>`).join("");

    const tarjeta = document.createElement("article");
    tarjeta.className = "post";
    tarjeta.innerHTML = `
      <div class="post__img" style="background-image: url('${producto.imagen}'); background-color: #b8c9c4;"></div>
      <div class="post__body">
        <div class="post__tags">${tags}</div>
        <h3 class="post__title">${producto.titulo}</h3>
        <p class="post__date">${producto.dato}</p>
        <a href="#" class="btn btn--grad">${producto.boton}</a>
      </div>
    `;
    productosGrid.appendChild(tarjeta);
  });
}