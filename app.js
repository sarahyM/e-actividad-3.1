const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const pool = require("./conexion");
const indexRouter = require("./routes/index");
const cooperativasRouter = require("./routes/cooperativas");
const usuarioRouter = require("./routes/usuarios");
const cuentaRouter = require("./routes/cuentas");
const loginRouter = require("./routes/login");

const app = express();
const port = 3001;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));  // Corregido para servir archivos estáticos de la carpeta 'public'

// Configuración de las rutas
app.use("/", indexRouter);
app.use("/cooperativas", cooperativasRouter);
app.use("/usuarios", usuarioRouter);
app.use("/cuentas", cuentaRouter);
app.use("/login", loginRouter);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
