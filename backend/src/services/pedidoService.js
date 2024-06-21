
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Pedidos, PedidosItem, sequelize } = require("../database/models");

module.exports = {
  

    createPedido: async (pedidoData, res) => {

        const { TIPO, CLIENTE, NROPED, CODIGO, NROREAL, ESTADOSEG, items } = pedidoData;
        
        const transaction = await sequelize.transaction();
            try {
                const pedidos = await Pedidos.create({
                    TIPO,
                    CLIENTE,
                    NROPED,
                    NROREAL,
                    ESTADOSEG,
                    CODIGO
                }, { transaction } );   //

                if (!items || !Array.isArray(items)) {
                    throw new Error('items must be an array');
                }

                const pedidositem = await Promise.all(items.map(item => 
                    PedidosItem.create({
                        TIPO,
                        CLIENTE,
                        NROPED,
                        ITEM: item.ITEM
                    }, { transaction })  
                ));

                await transaction.commit();

                return { pedidos, pedidositem };
            } catch (error) {
                await transaction.rollback();
                throw new Error('Error al crear el pedido');
            }
    }, 


    updatePedido: async(updatedData, NROPED) => {
        // console.log("NROPEDDD: "+NROPED)
        // console.log("TIPODDD: "+data.tipo)
        // return Pedidos.update({
        //     TIPO: data.tipo,
        //     CLIENTE: data.cliente,
        //     NROPED: data.nroped,
        //     NROREAL: data.nroreal,
        //     ESTADOSEG: data.estadoseg,
        //     CODIGO: data.codigo
        // }, {
        //     where: {
        //         NROPED: NROPED,
        //         CLIENTE: data.cliente,
        //         CODIGO: data.codigo
        //     }
        // });

        try {
            console.log("NROPEDDDDDDDD: "+NROPED)
            console.log("TIPODDDDDDDDD: "+updatedData.TIPO)
            const pedido = await Pedidos.findOne({  
                where: {
                    NROPED: NROPED,
                    CLIENTE: updatedData.CLIENTE,
                    TIPO: updatedData.TIPO
                } 
            });
            // console.log("NROPEDDDDDDDD: "+NROPED)
            // console.log("TIPODDDDDDDDD: "+pedido.TIPO)
            if (pedido) {
                await pedido.update(updatedData);
                return pedido;
            }
            return null;
        } catch (error) {
            throw new Error('Error al actualizar el pedido');
        }

    },

    editPedido: async(NROPED) => {
        // console.log("NROPED SERVICE: "+NROPED)
        // return Pedidos.findByPk(NROPED);
        try {
            const pedido = await Pedidos.findOne({ where: { NROPED } });
            return pedido;
        } catch (error) {
            throw new Error('Error al obtener el pedido');
        }
    },

    destroyPedido: (NROPED) => {
        return Pedidos.destroy({
            where: {
                NROPED: NROPED
            }
        });
    },

    destroyPedidosItem: (NROPED) => {
        return PedidosItem.destroy({
            where: {
                NROPED: NROPED
            }
        });
    },

    deletePedido: (NROPED) => {
        return Pedidos.findByPk(NROPED);
    },

    // getAllProducts: () => {
    //     // return Pedidos.findAll({ include: ['categorias', 'marcas'] });  // include: ["categoria", "marca"] hace referencia al alias de la asociaciones entre las claves foraneas de las tablas
    //     return Pedidos.findAll({ 
    //         include: ['pedidositem','clientes'],
    //         where: {
    //             TIPO: 'P',
    //             CODIGO: '21',
    //             FECEMISION: {
    //                 [Op.gte]: new Date('2024-01-01'),   //gt = Greater than operacion de compracion nativa de sequelize
    //             },
    //         },
    //         order: [["NROPED", "ASC"]],
    //     });
    // },


    getAllPedidos: async () => {
        try {
            const pedidos = await Pedidos.findAll({
                where: {
                    TIPO: 'P',
                    CODIGO: '21',
                    FECEMISION: {
                        [Op.gte]: new Date('2024-01-01'), // gte = Greater than or equal
                    },
                },
                include: [
                    {
                        model: models.PedidosItem,
                        as: 'pedidositem',
                        where: {
                            TIPO: 'P'
                        },
                        required: false, // Utilizamos LEFT OUTER JOIN
                    },
                    {
                        model: models.Clientes,
                        as: 'clientes',
                        required: false, // LEFT OUTER JOIN
                        foreignKey: 'CLIENTE', // Clave foránea correcta
                    }
                ],
                order: [["NROPED", "ASC"]],
            });
            return pedidos;
        } catch (error) {
            console.error("Error al obtener los pedidos:", error);
            throw error; // Propaga el error para manejo posterior si es necesario
        }
    },


    getAllPedidosItems: (nroped) => {
       
        return PedidosItem.findAll({ 
            where: {
                NROPED: nroped,
                TIPO: 'P',
                // FECALTA: {
                //     [Op.gte]: new Date('2024-01-01'),   //gt = Greater than operacion de compracion nativa de sequelize
                // },
            },

            order: [["NROPED", "ASC"]],
            
        });
    },


    getProductDetail: (id) => {
        return Productos.findByPk(id, { include: ['categorias', 'marcas'] });
    },

    getByCategory: (categoryId) => {
        return Productos.findAll({
            include: ['categorias', 'marcas'],
            where: {
                categoria_id: categoryId,
            },
            order: [["nombre", "ASC"]],
        });
    },

    searchProducts: (data) => {
        return Productos.findAll({
            include: ['categorias', 'marcas'],
            where: {
                nombre: { [Op.like]: `%${data.search}%` },
            },
            order: [["nombre", "ASC"]],
        });
    },

};