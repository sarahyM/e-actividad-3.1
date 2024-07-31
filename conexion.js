const mysql = require("mysql2");
require("dotenv").config();

const dbHost = "localhost"; //process.env.DB_HOST;
const dbUser = "root"; //process.env.DB_USER;
const dbPassword = "root"; //process.env.DB_PASSWORD;
const dbName = "sistema_bancario"; //process.env.DB_NAME;
const dbPort = 3306; //process.env.DB_PORT

// Conexión a la base de datos usando las variables de entorno
const pool = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
});

pool.connect(function (error) {
  if (error) {
    console.error("Error conectando a la base de datos:", error);
    return;
  }
  console.log("Conectado a la base de datos MySQL.");
});

module.exports = pool;
