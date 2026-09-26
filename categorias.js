// ---------- Categorías ----------
// El ícono, nombre y descripción siguen fijos (son solo texto informativo),
// pero la CANTIDAD ahora se calcula de verdad contando lo que hay guardado
// en productos-store.js — ya no es un número inventado.

const categorias = [
  { icono: "📚", nombre: "Libros",
    descripcion: "Libros de texto, guías de estudio, apuntes impresos" },
  { icono: "💻", nombre: "Tecnología",
    descripcion: "Calculadoras, portátiles, audífonos, cargadores" },
  { icono: "👕", nombre: "Ropa",
    descripcion: "Batas de laboratorio, uniformes, chaquetas de universidad" },
  { icono: "🎓", nombre: "Servicios",
    descripcion: "Tutorías, diseño gráfico, impresión de trabajos" }
];

const categoriasGrid = document.getElementById("categoriasGrid");

categorias.forEach((cat) => {
  const cantidad = obtenerProductosPorCategoria(cat.nombre).length;

  const tarjeta = document.createElement("article");
  tarjeta.className = "card card--categoria";
  tarjeta.innerHTML = `
    <div class="card__icon">${cat.icono}</div>
    <h2>${cat.nombre}</h2>
    <p class="card__cantidad">${cantidad} producto${cantidad === 1 ? "" : "s"}</p>
    <p>${cat.descripcion}</p>
    <a href="productos.html?categoria=${encodeURIComponent(cat.nombre)}" class="btn btn--outline">Ver ${cat.nombre.toLowerCase()}</a>
  `;
  categoriasGrid.appendChild(tarjeta);
});