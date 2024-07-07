const CooperativaModel = require('../models/cooperativas');

class CooperativaController {
    AñadirCooperativa(req, res) {
        const { id, fechaCooperativa, cooperativa, balanceCooperativa } = req.body;
        const nuevaCooperativa = { id: parseInt(id), fechaCooperativa, cooperativa, balanceCooperativa };
        CooperativaModel.añadirCooperativa(nuevaCooperativa)
            .then(results => res.status(201).json({ mensaje: 'Se ha añadido la cooperativa', cooperativa: nuevaCooperativa }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    EliminarUsuarioDeCooperativa(req, res) {
        const { cooperativaId, usuarioId } = req.params;
        CooperativaModel.eliminarUsuarioDeCooperativa(cooperativaId, usuarioId)
            .then(results => res.json({ mensaje: 'Usuario eliminado de la cooperativa' }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    RelacionarUsuarioConCooperativa(req, res) {
        const { cooperativaId, usuarioId } = req.params;
        CooperativaModel.relacionarUsuarioConCooperativa(cooperativaId, usuarioId)
            .then(results => res.json({ mensaje: 'Usuario añadido a la cooperativa' }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    ObtenerTodasCooperativas(req, res) {
        CooperativaModel.obtenerTodasCooperativas()
            .then(cooperativas => res.render('cooperativas', { cooperativas }))
            .catch(error => res.status(500).json({ error: error.message }));
    }

    ObtenerDetallesCooperativa(req, res) {
        const { id } = req.params;
        CooperativaModel.obtenerDetallesCooperativa(id)
            .then(cooperativa => {
                if (cooperativa) {
                    res.render('detalleCooperativa', { cooperativa });
                } else {
                    res.status(404).json({ mensaje: 'No se encontró la cooperativa en la base de datos' });
                }
            })
            .catch(error => res.status(500).json({ error: error.message }));
    }
}

module.exports = new CooperativaController();
