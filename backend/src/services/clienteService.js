
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Clientes } = require("../database/models");

module.exports = {
  
    getAllClientes: async (numeroVendedor) => {
        try {
            const clientes = await Clientes.findAll({
                where: {
                    FECINHAB: null,
                    VENDEDOR: numeroVendedor,
                },
                order: [["RAZONSOC", "ASC"]],
            });
            return clientes;
        } catch (error) {
            throw new Error('Error al obtener los artículos: ' + error.message);
        }
    },

};