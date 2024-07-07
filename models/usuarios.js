const pool = require("../conexion");
const {AñadirCuentaPrestamo} = require("../controllers/cuentas");
const {AñadirCuentaAhorro} = require("../controllers/cuentas");
const {AñadirCooperativa} = require("../controllers/cooperativas"); // Importa el modelo de préstamos si no lo has hecho aún
 // Importa el modelo de préstamos si no lo has hecho aún
 // Importa el modelo de préstamos si no lo has hecho aún
const cooperativa = require("./cooperativas");

class UsuariosModel {
  static async obtenerTodosLosUsuarios() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM usuarios", (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  static async añadirUsuario(usuario) {
    return new Promise((resolve, reject) => {
      const {
        id,
        nombre,
        hashedPassword,
        tipoCuenta,
        balance,
        fechaProximoPago,
        tasaInteres,
        cooperativa,
        balanceCooperativa,
        fechaCooperativa,
        rol,
      } = usuario;

      // Insert basic user data into the 'usuarios' table
      pool.query(
        "INSERT INTO usuarios (id, nombre, pasword, rol) VALUES (?, ?, ?, ?)",
        [id, nombre, hashedPassword, rol],
        (error, results) => {
          if (error) {
            return reject(error);
          }

          // Based on 'tipoCuenta', insert data into the respective table
          switch (tipoCuenta) {
            case "ahorro":
              AñadirCuentaAhorro(id, balance, tasaInteres);
              break;
            case "prestamo":
              AñadirCuentaPrestamo(id, balance, fechaProximoPago, tasaInteres);
              break;
            case "cooperativa":
              AñadirCooperativa(
                id,
                cooperativa,
                balanceCooperativa,
                fechaCooperativa
              );
              break;
            default:
              // Handle invalid 'tipoCuenta' value
              console.error(`Tipo de cuenta no válido: ${tipoCuenta}`);
              break;
          }

          resolve(results);
        }
      );
    });
  }

  // Function to insert data into the 'ahorro' table

  // Function to insert data into the 'prestamos' table

  static async editarUsuario(id, usuario) {
    return new Promise((resolve, reject) => {
      const { nombre } = usuario;
      pool.query(
        "UPDATE usuarios SET nombre = ? WHERE id = ?",
        [nombre, id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static async borrarUsuario(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  static async obtenerDetallesUsuario(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM usuarios usu, prestamos pres, ahorros aho, cooperativas coop WHERE usu.id = ? AND (pres.usuarioId = usu.id OR usu.id = aho.usuarioId);",
        [id], // Pass the 'id' parameter to the query
        (error, results) => {
          if (error) {
            console.error("Error obtaining user details:", error.message);
            return reject(error);
          }

          if (!results.length) {
            return resolve(null); // No user found
          }

          resolve(results[0]);
        }
      );
    });
  }

  // editarAhorro function
  static async editarAhorro(id, balance) {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE ahorros SET balance = ? WHERE usuarioId = ?",
        [balance, id], // Use 'id' in the WHERE clause
        (error, result) => {
          if (error) {
            console.error("Error updating ahorros balance:", error.message);
            reject(error);
            return;
          }

          if (result.affectedRows === 0) {
            console.error("No ahorros found for user:", id);
            reject(new Error("No ahorros found for user"));
            return;
          }

          resolve(result);
        }
      );
    });
  }

  // editarPrestamo function
  static async editarPrestamo(id, balance) {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE prestamos SET balance = ? WHERE usuarioId = ?",
        [balance, id], // Use 'id' in the WHERE clause
        (error, result) => {
          if (error) {
            console.error("Error updating prestamos balance:", error.message);
            reject(error);
            return;
          }

          if (result.affectedRows === 0) {
            console.error("No prestamos found for user:", id);
            reject(new Error("No prestamos found for user"));
            return;
          }

          resolve(result);
        }
      );
    });
  }
}

module.exports = UsuariosModel;
