const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarios");
const {
  verifyTokenAndExtractUser,
  isAdmin,
  isEmployee,
  isClient,
  isAdminOrEmployee,
  isAdminOrClient} = require("../controllers/auth"); // Replace with the path to your file

/* const cuentacontroller = require("../controllers/cuentas")
 */

router.get("/", verifyTokenAndExtractUser, isAdmin, (req, res) =>
  usuarioController.ObtenerTodosLosUsuarios(req, res)
);
router.post("/", verifyTokenAndExtractUser, isAdmin, (req, res) => usuarioController.AñadirUsuario(req, res));
/* router.post("/", (req, res) => cuentacontroller.AñadirCuentaAhorro(req, res));

router.post("/", (req, res) => cuentacontroller.AñadirCuentaPrestamo(req, res));
 */

router.put("/:id", verifyTokenAndExtractUser, isAdmin, (req, res) =>
  usuarioController.EditarUsuario(req, res)
);
router.delete("/:id", verifyTokenAndExtractUser, isAdmin, (req, res) =>
  usuarioController.BorrarUsuario(req, res)
);
router.get("/:id", verifyTokenAndExtractUser, isAdminOrClient, (req, res) =>
  usuarioController.ObtenerDetallesUsuario(req, res)
);
router.get(
  "/resumen/:id",
  verifyTokenAndExtractUser,
  isAdminOrClient,
  (req, res) => usuarioController.ObtenerResumenUsuario(req, res)
);


router.get(
  "/:id/balance",
  verifyTokenAndExtractUser,
  isAdminOrEmployee,
  (req, res) => usuarioController.ObtenerBalanceUsuario(req, res)
);
router.put(
  "/:id/balance",
  verifyTokenAndExtractUser,
  isAdminOrEmployee,
  (req, res) => usuarioController.EditarBalanceUsuario(req, res)
);

module.exports = router;
