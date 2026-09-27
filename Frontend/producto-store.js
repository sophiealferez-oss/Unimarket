// ============================================================
// productos-store.js
// ------------------------------------------------------------
// Guarda y lee los productos publicados, usando localStorage
// mientras la conexión a Oracle no está lista.
//
// IMPORTANTE PARA CUANDO MIGREN A ORACLE:
// Solo hay que cambiar el CONTENIDO de estas 4 funciones para que
// hagan fetch() a tu API (server.js) en vez de tocar localStorage.
// Ningún otro archivo (publicar.html, categorias.js, productos.js)
// necesita cambiar, porque todos usan estas funciones, nunca
// localStorage directamente.
// ============================================================

const CLAVE_STORAGE = "unimarket_productos";

// Lee todos los productos guardados
function obtenerProductos() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  return guardado ? JSON.parse(guardado) : [];
}

// Guarda un producto nuevo. Recibe un objeto con:
// { nombre, categoria, precio, estado, descripcion, imagen }
// (estos nombres coinciden con las columnas de tu tabla PRODUCTO,
// cambiando VendedorId por ahora ya que no hay login todavía)
function guardarProducto(producto) {
  const productos = obtenerProductos();

  const nuevoProducto = {
    id: Date.now(),                       // simula ProductoId autoincremental
    nombre: producto.nombre,
    categoria: producto.categoria,
    precio: producto.precio,
    estado: producto.estado,
    descripcion: producto.descripcion || "",
    imagen: producto.imagen || "",
    correoVendedor: producto.correoVendedor || "",        // dataURL de la primera foto, o vacío
    fechaPublicacion: new Date().toISOString(),
  };

  productos.unshift(nuevoProducto); // el más nuevo aparece primero
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
  return nuevoProducto;
}

// Todos los productos de una categoría (case-insensitive)
function obtenerProductosPorCategoria(categoria) {
  return obtenerProductos().filter(
    (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
  );
}

// Un producto por id (para la página de detalle)
function obtenerProductoPorId(id) {
  return obtenerProductos().find((p) => String(p.id) === String(id));
}