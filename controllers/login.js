const pool = require("../conexion");
const jwt = require("jwt-simple");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;


function createToken(userData) {
  const payload = {
    userId: userData.id,
    rol: userData.rol, // Include user role in payload
  };
  const token = jwt.encode(payload, secretKey);
  return token;
}

const loginController = class {
  login(req, res) {
    pool.query(
      "SELECT * FROM usuarios WHERE nombre = ?",
      [req.body.nombre],
      async (error, results) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Error al consultar la base de datos" });
        }

        if (!results.length) {
          return res.status(401).json({ error: "Usuario no encontrado" });
          console.log(results);
        }

        const usuario = results[0];

        if (!req.body.pasword) {
          return res
            .status(400)
            .json({ error: "Missing password in request body" });
        }

        try {
          const isPasswordValid = await bcrypt.compare(
            req.body.pasword,
            usuario.pasword
          );
          if (isPasswordValid) {
            const token = createToken(usuario); // Generate token using user ID
            res.cookie("token", token, { httpOnly: true }); // Store token in cookie
            res.json({ success: true });
            console.log("Token generated: " + token);
            console.log({usuario: usuario})
          } else {
            res.status(401).json({ error: "Invalid username or password" });
          }
        } catch (bcryptError) {
          console.error(bcryptError);
          res.status(500).json({ error: "Error al comparar contraseñas" });
        }
      }
    );
  }

  logout(req, res) {
    res.clearCookie("token"); // Clear the token cookie
    res.render("sesion", { sesion: "Cerrada" }); // Success message
  }

  
};



module.exports = new loginController();
