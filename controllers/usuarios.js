const UsuarioModel = require("../models/usuarios");
const bcrypt = require("bcryptjs");
require("dotenv").config();


const saltRounds = parseInt(process.env.SALT_KEY);


class UsuarioController {
  ObtenerTodosLosUsuarios(req, res) {
    console.log(`GET5`);
    UsuarioModel.obtenerTodosLosUsuarios()
      .then((usuarios) => res.render("usuarios", { usuarios }))
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  async AñadirUsuario(req, res) {
    const { id, nombre, pasword, rol } = req.body;

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(pasword, saltRounds);

      const nuevoUsuario = { id: parseInt(id), nombre, hashedPassword, rol };

      // Call your UsuarioModel.añadirUsuario function
      const results = await UsuarioModel.añadirUsuario(nuevoUsuario);

      res
        .status(201)
        .json({ mensaje: "Se ha añadido el usuario", usuario: nuevoUsuario });
    } catch (error) {
      console.error("Error adding user:", error.message);
      res.status(500).json({ error: "Error al añadir usuario" });
    }
  }
  EditarUsuario(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;
    UsuarioModel.editarUsuario(id, { nombre })
      .then((results) =>
        res.json({
          mensaje: "Usuario actualizado",
          usuario: { id, nombre },
        })
      )
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  BorrarUsuario(req, res) {
    const { id } = req.params;
    UsuarioModel.borrarUsuario(id)
      .then((results) => res.json({ mensaje: "Usuario eliminado" }))
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  ObtenerDetallesUsuario(req, res) {
    const { id } = req.params;
    UsuarioModel.obtenerDetallesUsuario(id)
      .then((usuario) => {
        if (usuario) {
          res.render("detalleUsuario", { usuario });
        } else {
          res
            .status(404)
            .json({ mensaje: "No se encontró el usuario en la base de datos" });
        }
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  ObtenerResumenUsuario(req, res) {
    const { id } = req.params;
    UsuarioModel.obtenerDetallesUsuario(id)
      .then((usuario) => {
        if (usuario) {
          res.render("resumenUsuario", { usuario });
        } else {
          res
            .status(404)
            .json({ mensaje: "No se encontró el usuario en la base de datos" });
        }
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  ObtenerCuentasUsuario(req, res) {
    // Aquí podemos integrar funciones adicionales para obtener cuentas de usuario
    // Por ahora mantendremos la lógica básica y después la ajustaremos
  }

  async IniciarSesion(req, res) {
    const { nombre, password } = req.body;

    try {
      // Find the user by username
      const usuario = await UsuarioModel.obtenerUsuarioPorNombre(nombre);

      if (!usuario) {
        // User not found
        return res
          .status(401)
          .json({ error: "Usuario o contraseña incorrectos" });
      }

      // Compare the entered password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, usuario.password);

      if (!isPasswordValid) {
        // Invalid password
        return res
          .status(401)
          .json({ error: "Usuario o contraseña incorrectos" });
      }

      // Login successful
      // You can generate a JWT token here or use session-based authentication
      // For this example, we'll just send a success message
      res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      res.status(500).json({ error: "Error durante el inicio de sesión" });
    }
  }

  ObtenerBalanceUsuario(req, res) {
    const { id } = req.params;
    UsuarioModel.obtenerDetallesUsuario(id)
      .then((usuario) => {
        if (usuario) {
          res.render("balance", { usuario });
        } else {
          res
            .status(404)
            .json({ mensaje: "No se encontró el usuario en la base de datos" });
        }
      })
      .catch((error) => res.status(500).json({ error: error.message }));
  }

  EditarBalanceUsuario(req, res) {
    const { id } = req.params;
    const { balance } = req.body;

    // Update ahorros balance
    UsuarioModel.editarAhorro(id, balance)
      .then((ahorrosResult) => {
        // Check if ahorros update was successful
        if (!ahorrosResult || ahorrosResult.affectedRows === 0) {
          return res
            .status(400)
            .json({ error: "Error al actualizar el balance de ahorros" });
        }

        // Update prestamos balance
        return UsuarioModel.editarPrestamo(id, balance);
      })
      .then((prestamosResult) => {
        // Check if prestamos update was successful
        if (!prestamosResult || prestamosResult.affectedRows === 0) {
          return res
            .status(400)
            .json({ error: "Error al actualizar el balance de prestamos" });
        }

        // Both updates successful
        console.log("Balance actualizado exitosamente para el usuario:", id); // Log success
        res.json({ mensaje: "Usuario actualizado", usuario: { id, balance } });
      })
      .catch((error) => {
        console.error("Error al actualizar el balance:", error.message); // Log error
        res.status(500).json({ error: "Error al actualizar el balance" }); // Generic error message for client
      });
  }
}



module.exports = new UsuarioController();
