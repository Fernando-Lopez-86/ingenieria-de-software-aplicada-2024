const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Tablas } = require("../database/models");

module.exports = {
  
    getAllFormasPago: async () => {
        try {
            const formasPago = await Tablas.findAll({
                where: {
                    CLAVE: {
                        [Op.like]: 'SI08%'
                    },
                    [Op.or]: [
                        { ALFA07: 'V' },
                        { ALFA07: null }
                    ]
                },
                order: [["ALFA01", "DESC"]],
            });

            const opciones = formasPago.map(fp => ({
                value: fp.CLAVE.slice(-2),
                label: fp.ALFA01
            }));

            return opciones;
        } catch (error) {
            throw new Error('Error al obtener los artículos: ' + error.message);
        }
    },

    getAllProvincias: async () => {
        try {
            const provincias = await Tablas.findAll({
                where: {
                    CLAVE: {
                        [Op.like]: 'SI031%'
                    },
                    ALFA03: {
                        [Op.ne]: null
                    }
                },
                order: [["ALFA01", "DESC"]],
            });

            const opciones = provincias.map(fp => ({
                value: fp.CLAVE.slice(-2),
                label: fp.ALFA01
            }));

            return opciones;
        } catch (error) {
            throw new Error('Error al obtener los artículos: ' + error.message);
        }
    },

};