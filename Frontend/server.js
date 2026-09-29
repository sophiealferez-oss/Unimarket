// ============================================================
// server.js — API de UniMarket (Express + Oracle)
// Variables que espera en tu .env (cambia los nombres abajo si
// los tuyos son distintos):
//   DB_USER, DB_PASSWORD, DB_CONNECT_STRING  (ej: localhost:1521/XEPDB1)
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

const PUERTO = 3000;
const BASE_URL = `http://localhost:${PUERTO}`;
const DOMINIO = '@universitariadecolombia.edu.co';
const CATEGORIAS = ['Libros', 'Tecnología', 'Ropa', 'Servicios'];
const CONDICIONES = ['nuevo', 'como-nuevo', 'buen-estado', 'funcional'];

const app = express();
<<<<<<< HEAD
app.use(cors());
app.use(express.json({ limit: '10mb' })); // las fotos llegan como texto base64

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
};

// Carpeta donde se guardan las fotos (en Oracle solo va la ruta)
const carpetaUploads = path.join(__dirname, 'uploads');
if (!fs.existsSync(carpetaUploads)) fs.mkdirSync(carpetaUploads);
app.use('/uploads', express.static(carpetaUploads));

// ---------- Helpers ----------
async function ejecutar(sql, binds = {}, opciones = {}) {
  let conexion;
=======
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

app.post('/api/TipoCategoria', async (req, res) => {
  const { nombre } = req.body;
  let connection;
>>>>>>> origin/main
  try {
    conexion = await oracledb.getConnection(dbConfig);
    return await conexion.execute(sql, binds, { autoCommit: true, ...opciones });
  } finally {
    if (conexion) await conexion.close();
  }
}

function guardarImagen(dataUrl) {
  const m = /^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/.exec(dataUrl || '');
  if (!m) return '';
  const extension = m[1] === 'jpeg' ? 'jpg' : m[1];
  const nombreArchivo = `${Date.now()}.${extension}`;
  fs.writeFileSync(path.join(carpetaUploads, nombreArchivo), Buffer.from(m[2], 'base64'));
  return `/uploads/${nombreArchivo}`;
}

// Convierte una fila de Oracle (MAYÚSCULAS) al mismo formato que
// ya usa el frontend, para no tener que cambiar las páginas.
function formatearProducto(f) {
  return {
    id: f.PRODUCTOID,
    nombre: f.NOMBRE,
    categoria: f.CATEGORIA,
    precio: f.PRECIO,
    estado: f.CONDICION, // el frontend llama "estado" a la condición del producto
    descripcion: f.DESCRIPCION,
    imagen: f.IMAGEN ? `${BASE_URL}${f.IMAGEN}` : '',
    correoVendedor: f.CORREOINSTITUCIONAL,
    fechaPublicacion: f.FECHAPUBLICACION,
  };
}

const SELECT_PRODUCTO = `
  SELECT p.ProductoId, p.Nombre, p.Categoria, p.Precio, p.Condicion,
         p.Descripcion, p.Imagen, p.FechaPublicacion, u.CorreoInstitucional
  FROM PRODUCTO p
  JOIN USUARIO u ON u.UsuarioId = p.VendedorId
  WHERE p.Estado = 'disponible'`;

// ---------- Usuarios ----------
app.post('/api/usuarios', async (req, res) => {
  try {
    const nombre = String(req.body.nombre || '').trim();
    const correo = String(req.body.correoInstitucional || '').trim().toLowerCase();

    if (!nombre || !correo.endsWith(DOMINIO)) {
      return res.status(400).json({ error: `Nombre y correo ${DOMINIO} son obligatorios` });
    }

    const existe = await ejecutar(
      'SELECT UsuarioId FROM USUARIO WHERE CorreoInstitucional = :correo', { correo });
    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Ese correo ya está registrado' });
    }

    await ejecutar(
      'INSERT INTO USUARIO (Nombre, CorreoInstitucional) VALUES (:nombre, :correo)',
      { nombre, correo });
    res.status(201).json({ mensaje: 'Usuario creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
app.get('/api/usuarios/existe', async (req, res) => {
  try {
    const correo = String(req.query.correo || '').trim().toLowerCase();
    const r = await ejecutar(
      'SELECT 1 FROM USUARIO WHERE CorreoInstitucional = :correo', { correo });
    res.json({ existe: r.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Productos ----------
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, categoria, precio, estado, descripcion, imagen, correoVendedor } = req.body;
    const correo = String(correoVendedor || '').trim().toLowerCase();

    if (!nombre || !CATEGORIAS.includes(categoria) || !CONDICIONES.includes(estado)
        || isNaN(Number(precio)) || Number(precio) < 0) {
      return res.status(400).json({ error: 'Datos del producto incompletos o inválidos' });
    }

    const usuario = await ejecutar(
      'SELECT UsuarioId FROM USUARIO WHERE CorreoInstitucional = :correo', { correo });
    if (usuario.rows.length === 0) {
      return res.status(403).json({ error: 'Ese correo no está registrado' });
    }

    const resultado = await ejecutar(
      `INSERT INTO PRODUCTO (VendedorId, Categoria, Nombre, Descripcion, Precio, Imagen, Condicion)
       VALUES (:vendedorId, :categoria, :nombre, :descripcion, :precio, :imagen, :condicion)
       RETURNING ProductoId INTO :id`,
      {
        vendedorId: usuario.rows[0].USUARIOID,
        categoria,
        nombre,
        descripcion: (descripcion || '').trim() || 'Sin descripción',
        precio: Number(precio),
        imagen: guardarImagen(imagen),
        condicion: estado,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
      });

    res.status(201).json({ id: resultado.outBinds.id[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/productos', async (req, res) => {
  try {
    const categoria = req.query.categoria;
    const sql = SELECT_PRODUCTO
      + (categoria ? ' AND LOWER(p.Categoria) = LOWER(:categoria)' : '')
      + ' ORDER BY p.ProductoId DESC';
    const r = await ejecutar(sql, categoria ? { categoria } : {});
    res.json(r.rows.map(formatearProducto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  try {
    const r = await ejecutar(SELECT_PRODUCTO + ' AND p.ProductoId = :id', { id: Number(req.params.id) });
    if (r.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(formatearProducto(r.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- Arranque ----------
app.listen(PUERTO, async () => {
  console.log(`Servidor corriendo en ${BASE_URL}`);
  try {
    await ejecutar('SELECT 1 FROM DUAL');
    console.log('✅ Conectado a Oracle');
  } catch (err) {
    console.error('❌ No se pudo conectar a Oracle:', err.message);
  }
=======
app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


app.post('/api/usuario', async (req, res) => {

    const {
        Nombre,
        CorreoInstitucional,
        CorreoVerificado
    } = req.body;

    let connection;

    try {

        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });


        const resultado = await connection.execute(
            `INSERT INTO USUARIO
            (Nombre, CorreoInstitucional, CorreoVerificado)
            VALUES
            (:Nombre, :CorreoInstitucional, :CorreoVerificado)
            RETURNING UsuarioId INTO :UsuarioId`,

            {
                Nombre,
                CorreoInstitucional,
                CorreoVerificado,

                UsuarioId: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.NUMBER
                }
            },

            {
                autoCommit: true
            }
        );


        const usuarioId = resultado.outBinds.UsuarioId[0];


        res.json({
            mensaje: "Usuario registrado correctamente",
            UsuarioId: usuarioId
        });


    } catch (err) {

        console.error("Error al registrar usuario:", err);

        res.status(500).json({
            error: err.message
        });


    } finally {

        if (connection) {
            await connection.close();
        }

    }
});



app.post('/api/producto', async (req, res) => {

    const {
        TipoCategoria,
        Nombre,
        Descripcion,
        Precio,
        Imagen,
        Estado,
        CorreoVendedor
    } = req.body;

    let connection;

    try {

        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        // Buscar el vendedor por su correo
        const usuario = await connection.execute(
            `SELECT UsuarioId
             FROM USUARIO
             WHERE CorreoInstitucional = :correo`,
            {
                correo: CorreoVendedor
            }
        );

        if (usuario.rows.length === 0) {
            return res.status(404).json({
                error: 'El correo del vendedor no está registrado.'
            });
        }

        const vendedorId = usuario.rows[0][0];

        // Validar precio
        const precioNumero = Number(Precio);

        if (isNaN(precioNumero)) {
            return res.status(400).json({
                error: 'El precio no es válido.'
            });
        }

        // Insertar producto
        const resultado = await connection.execute(
            `INSERT INTO PRODUCTO
            (
                VendedorId,
                TipoCategoria,
                Nombre,
                Descripcion,
                Precio,
                Imagen,
                Estado
            )
            VALUES
            (
                :VendedorId,
                :TipoCategoria,
                :Nombre,
                :Descripcion,
                :Precio,
                :Imagen,
                :Estado
            )
            RETURNING ProductoId INTO :ProductoId`,

            {
                VendedorId: vendedorId,

                TipoCategoria: TipoCategoria,

                Nombre: Nombre,

                Descripcion: Descripcion,

                Precio: precioNumero,

                Imagen: Imagen || null,

                Estado: Estado,

                ProductoId: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.NUMBER
                }
            },

            {
                autoCommit: true
            }
        );

        const productoId =
            resultado.outBinds.ProductoId[0];

        res.json({
            mensaje: 'Producto publicado correctamente',
            ProductoId: productoId
        });

    } catch (err) {

        console.error(
            'Error al publicar producto:',
            err
        );

        res.status(500).json({
            error: err.message
        });

    } finally {

        if (connection) {
            await connection.close();
        }
    }
>>>>>>> origin/main
});