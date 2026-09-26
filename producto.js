

const parametrosProducto = new URLSearchParams(window.location.search);
const idProducto = parametrosProducto.get("id");

const contenedorProducto = document.getElementById("contenedorProducto");
const heroTitulo = document.getElementById("heroTitulo");
const heroSubtitulo = document.getElementById("heroSubtitulo");

const producto = idProducto ? obtenerProductoPorId(idProducto) : null;

const nombresEstado = {
  "nuevo": "Nuevo",
  "como-nuevo": "Como nuevo",
  "buen-estado": "Usado - buen estado",
  "funcional": "Usado - funcional",
};

if (!producto) {
  heroTitulo.textContent = "Producto no encontrado";
  heroSubtitulo.textContent = "Puede que ya no esté disponible o el enlace esté mal.";

  contenedorProducto.innerHTML = `
    <div class="card producto--vacio">
      <div class="card__icon">🔍</div>
      <h2>No encontramos este producto</h2>
      <p>Puede que ya lo hayan vendido, o el enlace que usaste esté incompleto.</p>
      <a href="categorias.html" class="btn btn--teal">Ver categorías</a>
    </div>
  `;
} else {
  heroTitulo.textContent = producto.nombre;
  heroSubtitulo.textContent = `Publicado en ${producto.categoria}`;

  const precioFormateado = Number(producto.precio).toLocaleString("es-CO");
  const fecha = new Date(producto.fechaPublicacion).toLocaleDateString("es-CO", {
    day: "numeric", month: "long", year: "numeric"
  });

  contenedorProducto.innerHTML = `
    <div class="producto">
      <div class="producto__imagen" style="background-image: url('${producto.imagen}');"></div>

      <div>
        <span class="producto__categoria">${producto.categoria}</span>
        <h2 class="producto__titulo">${producto.nombre}</h2>
        <div class="producto__precio">$${precioFormateado}</div>
        <span class="producto__estado">${nombresEstado[producto.estado] || producto.estado}</span>
        <p class="producto__descripcion">${producto.descripcion || "El vendedor no agregó una descripción."}</p>

        <button class="btn btn--teal" id="btnComprar">Contactar al vendedor</button>

        <p class="producto__fecha">Publicado el ${fecha}${producto.correoVendedor ? ` · ${producto.correoVendedor}` : ""}</p>
      </div>
    </div>
  `;

  
  document.getElementById("btnComprar").addEventListener("click", () => {
    alert("Función de contacto con el vendedor: próximamente. Por ahora, esto es una simulación.");
  });
}