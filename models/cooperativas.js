const pool = require('../conexion');

class CooperativaModel {
    static añadirCooperativa(cooperative) {
        return new Promise((resolve, reject) => {
            const { id, fechaCooperativa, cooperativa, balanceCooperativa } =
              cooperative;
            pool.query('INSERT INTO cooperativas (usuarioID, fechaCooperativa, balanceCooperativa, tipo) VALUES (?, ?, ?, ?)', [id, fechaCooperativa, balanceCooperativa, cooperativa], (error, results) => {
                if (error) {
                    return reject(error);
                }
               /*  const cooperativaId = results.insertId;
                if (usuariosDeCooperativa && usuariosDeCooperativa.length > 0) {
                    const usuarioPromises = usuariosDeCooperativa.map(usuarioId => 
                        new Promise((resolve, reject) => {
                            pool.query('UPDATE usuarios SET cooperativaId = ? WHERE id = ?', [cooperativaId, usuarioId], (error, results) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve(results);
                            });
                        })
                    );
                    Promise.all(usuarioPromises)
                        .then(() => resolve(results))
                        .catch(reject);
                } else {
                } */
                resolve(results);
            });
        });
    }

    static eliminarUsuarioDeCooperativa(cooperativaId, usuarioId) {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE usuarios SET cooperativaId = NULL WHERE id = ? AND cooperativaId = ?', [usuarioId, cooperativaId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static relacionarUsuarioConCooperativa(cooperativaId, usuarioId) {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE usuarios SET cooperativaId = ? WHERE id = ?', [cooperativaId, usuarioId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static obtenerTodasCooperativas() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cooperativas', (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static obtenerDetallesCooperativa(id) {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cooperativas WHERE id = ?', [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }

    static obtenerResumen() {
        return new Promise((resolve, reject) => {
            pool.query(`
                SELECT 
                    (SELECT COUNT(*) FROM ahorros) AS totalAhorros, 
                    (SELECT COUNT(*) FROM prestamos) AS totalPrestamos, 
                    (SELECT COUNT(*) FROM usuarios) AS totalUsuarios 
                FROM DUAL`, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results[0]);
            });
        });
    }
}

module.exports = CooperativaModel;
