const express = require('express');
const router = express.Router();
const cooperativaController = require('../controllers/cooperativas');
const usuarios = require('../controllers/usuarios');
const { verifyTokenAndExtractUser, isAdmin } = require('../controllers/auth');

// Añadir a cooperativa
router.post("/", (req, res) =>
  cooperativaController.AñadirCooperativa(req, res),
);

router.put("/:id", (req, res) => 
  cooperativaController.RelacionarUsuarioConCooperativa(req, res)
)

router.get("/", verifyTokenAndExtractUser, isAdmin, (req, res) => 
  res.render('añadircooperativa')
)

router.get("/abonar/:id", verifyTokenAndExtractUser, (req, res) => 
  cooperativaController.ObtenerDetallesAportante(req, res)
)

router.post("/abonar/:id", verifyTokenAndExtractUser, (req, res) => 
  cooperativaController.AbonarMonto(req, res)
)


module.exports = router;
