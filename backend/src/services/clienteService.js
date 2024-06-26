
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Clientes } = require("../database/models");

module.exports = {
  

    getAllClientes: async () => {
        try {
            const clientes = await Clientes.findAll({
                where: {
                    FECINHAB: null,
                },
                order: [["RAZONSOC", "ASC"]],
            });
            return clientes;
        } catch (error) {
            throw new Error('Error al obtener los artículos: ' + error.message);
        }
    },


};