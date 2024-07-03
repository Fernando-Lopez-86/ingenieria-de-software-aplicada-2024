
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Articulos } = require("../database/models");

module.exports = {
  
    getAllArticulos: async () => {
        try {
            const articulos = await Articulos.findAll({
                where: {
                    DESCRIP: { [Op.like]: `%SR:%` },
                    FECINHAB: null,
                },
                order: [["DESCRIP", "ASC"]],
            });
            return articulos;
        } catch (error) {
            throw new Error('Error al obtener los artículos: ' + error.message);
        }
    },

};