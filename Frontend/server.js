require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // para servir tus .html directamente

app.post('/api/tipocategoria', async (req, res) => {
  const { nombre } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });

    await connection.execute(
      `INSERT INTO TIPOCATEGORIA (NOMBRE) VALUES (:nombre)`,
      [nombre],
      { autoCommit: true } // importante: sin esto, el INSERT no se guarda de verdad
    );

    res.json({ mensaje: 'Categoría insertada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));


app.post('/api/usuario', async (req, res) => {
  const { UsuarioId,Nombre, CorreoInstitucional,CorreoVerificado } = req.body;
  let connection; 
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });

    await connection.execute(
      `INSERT INTO USUARIO (UsuarioId,Nombre, CorreoInstitucional,CorreoVerificado) VALUES (:UsuarioId,:Nombre,:CorreoInstitucional,:CorreoVerificado`,
      [UsuarioId,Nombre, CorreoInstitucional,CorreoVerificado],
      { autoCommit: true }
    );

    res.json({ mensaje: 'Usuario insertado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});



app.post('/api/producto', async (req, res) => {
  const { ProductoId,VendedorId, TipoCategoria, Nombre, Descripcion, Precio, Imagen,Estado,FechaPublicacion } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });

    await connection.execute(
      `INSERT INTO PRODUCTO (ProductoId,VendedorId, TipoCategoria, Nombre, Descripcion, Precio, Imagen,Estado,FechaPublicacion)
       VALUES (:ProductoId,:VendedorId, :TipoCategoria, :Nombre, :Descripcion, :Precio, :Imagen,:Estado,:FechaPublicacion)`,
      [ProductoId, VendedorId, TipoCategoria, Nombre, Descripcion, Precio, Imagen,Estado,FechaPublicacion],
      { autoCommit: true }
    );

    res.json({ mensaje: 'Producto insertado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});