const CuentaModel = require('../models/cuentas');

class CuentaController {
    AñadirCuentaPrestamo(req, res) {
        const { id, balance, tasaInteres, fechaProximoPago } = req.body;
        const nuevaCuenta = {
          id: parseInt(id),
          balance,
          tasaInteres,
          fechaProximoPago,
        };
        CuentaModel.añadirCuentaPrestamo(nuevaCuenta)
            .then(results => res.status(201).json({ mensaje: 'Se ha añadido la cuenta de préstamo', cuenta: nuevaCuenta }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    AñadirCuentaAhorro(req, res) {
        const { id, balance, tasaInteres } = req.body;
        const nuevaCuenta = { id: parseInt(id), balance, tasaInteres };
        CuentaModel.añadirCuentaAhorro(nuevaCuenta)
          .then((results) =>
            res
              .status(201)
              .json({
                mensaje: "Se ha añadido la cuenta de ahorro",
                cuenta: nuevaCuenta,
              })
          )
          .catch((error) => {
            res.status(500).json({ error: error.message });
            console.error("Error en controlador de cuentas"); // Added console.error here
          });
    }

    EditarCuentaPrestamo(req, res) {
        const { id } = req.params;
        const { balance, tasaInteres, fechaProximoPago } = req.body;
        CuentaModel.editarCuentaPrestamo(id, { balance, tasaInteres, fechaProximoPago })
            .then(results => res.json({ mensaje: 'Cuenta de préstamo actualizada', cuenta: { id, balance, tasaInteres, fechaProximoPago } }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    EditarCuentaAhorro(req, res) {
        const { id } = req.params;
        const { balance, tasaInteres } = req.body;
        CuentaModel.editarCuentaAhorro(id, { balance, tasaInteres })
            .then(results => res.json({ mensaje: 'Cuenta de ahorro actualizada', cuenta: { id, balance, tasaInteres } }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    EliminarCuentaPrestamo(req, res) {
        const { id } = req.params;
        CuentaModel.eliminarCuentaPrestamo(id)
            .then(results => res.json({ mensaje: 'Cuenta eliminada' }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    EliminarCuentaAhorro(req, res) {
        const { id } = req.params;
        CuentaModel.eliminarCuentaAhorro(id)
            .then(results => res.json({ mensaje: 'Cuenta eliminada' }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    MostrarProximaFechaPago(req, res) {
        const { id } = req.params;
        CuentaModel.mostrarProximaFechaPago(id)
            .then(fechaProximoPago => res.json({ fechaProximoPago }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    MostrarResumenCuentas(req, res) {
        CuentaModel.mostrarResumenCuentas()
            .then(resumen => res.json(resumen))
            .catch(error => res.status(500).json({ error: error.message }));
    }
}

module.exports = new CuentaController();
