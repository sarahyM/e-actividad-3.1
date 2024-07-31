const pool = require('../conexion');

class CooperativaModel {
    static añadirCooperativa(cooperative) {
        return new Promise((resolve, reject) => {
            const { recurrencia, montoRecurrente, fechaInicio } =
              cooperative;
            pool.query('INSERT INTO cooperativas (recurrencia, montoRecurrente, fechaInicio) VALUES (?, ?, ?)', [recurrencia, montoRecurrente, fechaInicio], (error, results) => {
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

    static actualizarNumeroAportantes(id, numeroAportantes) {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE cooperativas SET numeroAportantes = ? WHERE id = ?', [numeroAportantes, id], (error, results) => {
                if (error) {
                    return reject(error);
                }
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

    static abonarMonto(cooperativaId, usuarioId, monto) {
        return new Promise(async (resolve, reject) => {
            const { montoAportado } = await this.obtenerDetallesAportante(usuarioId);
            const montoTotalAportado = montoAportado + +monto;
            pool.query('UPDATE aportantesCooperativa SET montoAportado = ? WHERE cooperativaId = ? AND usuarioId = ?', [montoTotalAportado, cooperativaId, usuarioId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                this.actualizarFechaProximoAporte(cooperativaId, usuarioId)
                resolve(results);
            });
        });
    }

    static actualizarFechaProximoAporte(cooperativaId, usuarioId) {
        return new Promise(async (resolve, reject) => {
            const { recurrencia, fechaProximoAporte } = await this.obtenerDetallesAportante(usuarioId);
            const NuevafechaProximoAporte = this.calcularFechaProximoAporte(fechaProximoAporte, recurrencia)

            pool.query('UPDATE aportantesCooperativa SET fechaProximoAporte = ? WHERE cooperativaId = ? AND usuarioId = ?', [NuevafechaProximoAporte, cooperativaId, usuarioId], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static calcularFechaProximoAporte(fechaProximoAporte, recurrencia) {
        const fechaProximoAporteDate = new Date(fechaProximoAporte);
        let nuevaFechaProximoAporte = new Date(fechaProximoAporteDate);
        let dias;
 
        switch (recurrencia) {
            case 'semanal':
                dias =  7;
                nuevaFechaProximoAporte.setDate(nuevaFechaProximoAporte.getDate() + dias);
                break;
            case 'quincenal':
                dias = 15;
                nuevaFechaProximoAporte.setDate(nuevaFechaProximoAporte.getDate() + dias);
                break;
            case 'mensual':
                nuevaFechaProximoAporte.setMonth(nuevaFechaProximoAporte.getMonth() + 1 )
                break;
            default:
                throw new Error('Recurrencia no válida');
        }

        return nuevaFechaProximoAporte.toISOString().split('T')[0];
    }

    static relacionarUsuarioConCooperativa(cooperativaId, usuarioId) {
        return new Promise(async (resolve, reject) => {
            const {fechaInicio, recurrencia, numeroAportantes} = await this.obtenerDetallesCooperativa(cooperativaId);

            const fechaPago = this.calcularFechaPago(fechaInicio, recurrencia, numeroAportantes);
            const fechaProximoAporte = fechaInicio;
            const montoAportado = 0;
            pool.query(`INSERT INTO aportantesCooperativa (cooperativaId, usuarioId, fechaPago, fechaProximoAporte, montoAportado) VALUES (?, ?, ?, ?, ?)`, [cooperativaId, usuarioId, fechaPago, fechaProximoAporte, montoAportado], (error, results) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                this.actualizarNumeroAportantes(cooperativaId, numeroAportantes + 1)
                resolve(results);
            });
        });
    }

    static obtenerTodasCooperativas() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM cooperativas', (error, results) => {
                if (error) {
                    console.log(error)
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    static obtenerDetallesAportante(id) {
        return new Promise((resolve, reject) => {
            pool.query(`
                SELECT
                    c.id AS cooperativaId,
                    c.recurrencia,
                    c.montoRecurrente,
                    c.fechaInicio,
                    c.fechaFin,
                    ac.usuarioId,
                    u.nombre,
                    ac.fechaPago,
                    ac.fechaProximoAporte,
                    ac.montoAportado
                FROM
                    aportantesCooperativa ac
                JOIN
                    cooperativas c ON ac.cooperativaId = c.id
                JOIN
                    usuarios u ON ac.usuarioId = u.id
                WHERE
                    ac.usuarioId = ?;`, [id], (error, results) => {
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

    static calcularFechaPago(fechaInicio, recurrencia, numeroAportantes) {
        const fechaInicioDate = new Date(fechaInicio);
        let fechaPago = new Date(fechaInicioDate);
        let dias;
 
        switch (recurrencia) {
            case 'semanal':
                dias = numeroAportantes * 7;
                fechaPago.setDate(fechaPago.getDate() + dias);
                break;
            case 'quincenal':
                dias = numeroAportantes * 15;
                fechaPago.setDate(fechaPago.getDate() + dias);
                break;
            case 'mensual':
                fechaPago.setMonth(fechaPago.getMonth() + numeroAportantes )
                break;
            default:
                throw new Error('Recurrencia no válida');
        }

        return fechaPago.toISOString().split('T')[0];
    }
}

module.exports = CooperativaModel;
