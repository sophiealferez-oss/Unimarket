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