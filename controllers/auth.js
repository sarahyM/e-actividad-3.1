const jwt = require("jwt-simple");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;


function verifyToken(token) {
  try {
    return jwt.decode(token, secretKey);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Middleware to verify token and extract user data
const verifyTokenAndExtractUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).render("error", { error: "No autorizado" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.status(401).render("error", { error: "Token invalido" });
  }

  req.usuarios = decodedToken; // Store user data in req.user
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.usuarios.rol !== "admin") {
    return res.status(403).render("error", { error: "Contenido prohibido" });
  }
  next();
};

// Middleware to check if user is employee
const isEmployee = (req, res, next) => {
  if (req.usuarios.rol !== "empleado") {
    return res.status(403).render("error", { error: "Contenido prohibido" });
  }
  next();
};

// Middleware to check if user is client
const isClient = (req, res, next) => {
  if (req.usuarios.rol !== "cliente") {
    return res.status(403).render("error", { error: "Contenido prohibido" });
  }
  next();
};

const isAdminOrClient = (req, res, next) => {
  if (req.usuarios.rol === "admin" || req.usuarios.rol === "cliente") {
    next();
  } else {
    return res.status(403).render("error", { error: "Contenido prohibido" });
  }
};
const isAdminOrEmployee = (req, res, next) => {
  if (req.usuarios.rol === "admin" || req.usuarios.rol === "empleado") {
    next();
  } else {
    return res.status(403).render("error", { error: "Contenido prohibido" });
  }
};

module.exports = {
  verifyTokenAndExtractUser,
  isAdmin,
  isEmployee,
  isClient,
  isAdminOrClient,
  isAdminOrEmployee
};
