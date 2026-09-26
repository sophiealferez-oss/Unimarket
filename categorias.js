// ---------- Categorías: se generan a partir de datos ----------
const categorias = [
  { icono: "📚", nombre: "Libros", cantidad: 34,
    descripcion: "Libros de texto, guías de estudio, apuntes impresos" },
  { icono: "💻", nombre: "Tecnología", cantidad: 21,
    descripcion: "Calculadoras, portátiles, audífonos, cargadores" },
  { icono: "👕", nombre: "Ropa", cantidad: 15,
    descripcion: "Batas de laboratorio, uniformes, chaquetas de universidad" },
  { icono: "🛏️", nombre: "Dormitorio", cantidad: 12,
    descripcion: "Organizadores, ropa de cama, lámparas de estudio" },
  { icono: "🎓", nombre: "Servicios", cantidad: 9,
    descripcion: "Tutorías, diseño gráfico, impresión de trabajos" }
];

const categoriasGrid = document.getElementById("categoriasGrid");

categorias.forEach((cat) => {
  const tarjeta = document.createElement("article");
  tarjeta.className = "card card--categoria";
  tarjeta.innerHTML = `
    <div class="card__icon">${cat.icono}</div>
    <h2>${cat.nombre}</h2>
    <p class="card__cantidad">${cat.cantidad} productos</p>
    <p>${cat.descripcion}</p>
    <a href="productos.html?categoria=${encodeURIComponent(cat.nombre)}" class="btn btn--outline">Ver ${cat.nombre.toLowerCase()}</a>
  `;
  categoriasGrid.appendChild(tarjeta);
});
document.getElementById('formCategoria').addEventListener('submit', async (e) => {
  e.preventDefault(); // evita que la página se recargue

  const nombre = document.getElementById('nombreCategoria').value;

  try {
    const respuesta = await fetch('/api/tipocategoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });

    const data = await respuesta.json();

    if (respuesta.ok) {
      document.getElementById('mensaje').textContent = data.mensaje;
      document.getElementById('formCategoria').reset();
    } else {
      document.getElementById('mensaje').textContent = 'Error: ' + data.error;
    }
  } catch (err) {
    document.getElementById('mensaje').textContent = 'Error de conexión con el servidor';
  }
});