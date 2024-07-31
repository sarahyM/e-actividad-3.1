const pool = require("../conexion");

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
        `SELECT 
              usu.id AS usuarioId,
              usu.rol,
              usu.nombre,
              pres.id AS prestamoId,
              pres.balance AS prestamoBalance,
              pres.tasaInteres AS prestamoTasaInteres,
              pres.fechaProximoPago AS prestamoFechaProximoPago,
              aho.id AS ahorroId,
              aho.balance AS ahorroBalance,
              aho.tasaInteres AS ahorroTasaInteres,
              coop.id AS cooperativaId,
              coop.recurrencia,
              coop.montoRecurrente,
              coop.numeroAportantes,
              coop.fechaInicio,
              coop.fechaFin,
              ac.fechaPago,
              ac.fechaProximoAporte,
              ac.montoAportado
          FROM 
              usuarios usu
          LEFT JOIN 
              prestamos pres ON pres.usuarioId = usu.id
          LEFT JOIN 
              ahorros aho ON aho.usuarioId = usu.id
          LEFT JOIN 
              aportantesCooperativa ac ON ac.usuarioId = usu.id
          LEFT JOIN 
              cooperativas coop ON coop.id = ac.cooperativaId
          WHERE 
            usu.id = ?;`,
        [id], // Pass the 'id' parameter to the query
        (error, results) => {
          if (error) {
            console.error("Error obtaining user details:", error.message);
            return reject(error);
          }

          if (!results.length) {
            return resolve(null); // No user found
          }
          console.log(results);
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