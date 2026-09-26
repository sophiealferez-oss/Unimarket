require('dotenv').config();
const oracledb = require('oracledb');

async function probarConexion() {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });
    console.log('¡Conexión exitosa!');
    await connection.close();
  } catch (err) {
    console.error('Error de conexión:', err.message);
  }
}

probarConexion();