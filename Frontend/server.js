require('dotenv').config();
const express = require('express');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

app.post('/api/TipoCategoria', async (req, res) => {
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
});