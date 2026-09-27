// ---------- 1. Encabezado: transparente arriba, blanco al bajar ----------
const header = document.getElementById("header");

const actualizarHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
};
window.addEventListener("scroll", actualizarHeader);
actualizarHeader();

// ---------- 2. Menú hamburguesa (móvil) ----------
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
  const abierto = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", abierto);
  header.classList.toggle("scrolled", abierto || window.scrollY > 60);
});

// ---------- 3. Contador de mensajes/notificaciones (localStorage) ----------
// Antes era un contador de "compras del tema" ligado al botón "Buy STAX".
// En UniMarket el icono junto al menú representa mensajes/notificaciones,
// así que ya no se incrementa al hacer clic en "Publicar producto":
// ese botón debería llevar al formulario de publicación (cuando exista).
const cartCount = document.getElementById("cartCount");
const buyBtn = document.getElementById("buyBtn");

let mensajes = Number(localStorage.getItem("unimarketMensajes")) || 0;
cartCount.textContent = mensajes;

buyBtn.addEventListener("click", () => {
  // TODO: redirigir al formulario de "Publicar producto" en vez de
  // sumar un contador. Se deja el enlace normal del <a>/<button> por ahora.
});

// ---------- 4. Productos publicados, generados desde datos ----------
const productos = [
  { titulo: "Calculadora científica Casio FX-991", dato: "Bloque 4 · $45.000",
    etiquetas: ["Tecnología", "Destacado"], imagen: "img/producto1.jpg", boton: "Ver producto" },
  { titulo: "Cálculo diferencial (Stewart, 7ma ed.)", dato: "Sede A · $30.000",
    etiquetas: ["Libros"], imagen: "img/producto2.jpg", boton: "Ver producto" },
  { titulo: "Bata de laboratorio talla M", dato: "Publicado hace 2 días · $25.000",
    etiquetas: ["Ropa", "Dormitorio"], imagen: "img/producto3.jpg", boton: "Ver producto" },
  { titulo: "Tutorías de cálculo y física", dato: "Modalidad online · $20.000/h",
    etiquetas: ["Servicios", "Destacado"], imagen: "img/producto4.jpg", boton: "Contactar" },
  { titulo: "Portátil HP 14\" (i5, 8GB RAM)", dato: "Sede A · $950.000",
    etiquetas: ["Tecnología"], imagen: "img/producto5.jpg", boton: "Ver producto" },
  { titulo: "Audífonos inalámbricos", dato: "Bloque 2 · $60.000",
    etiquetas: ["Tecnología"], imagen: "img/producto6.jpg", boton: "Ver producto" },
  { titulo: "Cálculo integral (Larson, 9na ed.)", dato: "Sede A · $28.000",
    etiquetas: ["Libros"], imagen: "img/producto7.jpg", boton: "Ver producto" },
  { titulo: "Guía de bases de datos + apuntes", dato: "Publicado hace 5 días · $15.000",
    etiquetas: ["Libros"], imagen: "img/producto8.jpg", boton: "Ver producto" },
  { titulo: "Chaqueta institucional talla L", dato: "Bloque 3 · $70.000",
    etiquetas: ["Ropa"], imagen: "img/producto9.jpg", boton: "Ver producto" },
  { titulo: "Uniforme completo de laboratorio", dato: "Sede A · $55.000",
    etiquetas: ["Ropa"], imagen: "img/producto10.jpg", boton: "Ver producto" },
  { titulo: "Lámpara de escritorio LED", dato: "Publicado hace 1 día · $18.000",
    etiquetas: ["Dormitorio"], imagen: "img/producto11.jpg", boton: "Ver producto" },
  { titulo: "Organizador de escritorio", dato: "Bloque 4 · $12.000",
    etiquetas: ["Dormitorio"], imagen: "img/producto12.jpg", boton: "Ver producto" },
  { titulo: "Diseño de logos y piezas gráficas", dato: "Modalidad online · $35.000",
    etiquetas: ["Servicios"], imagen: "img/producto13.jpg", boton: "Contactar" },
  { titulo: "Impresión y anillado de trabajos", dato: "Bloque 1 · $2.000/hoja",
    etiquetas: ["Servicios"], imagen: "img/producto14.jpg", boton: "Contactar" }
];

const grid = document.getElementById("blogGrid");

if (grid) {
  productos.forEach((producto) => {
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
    grid.appendChild(tarjeta);
  });
}