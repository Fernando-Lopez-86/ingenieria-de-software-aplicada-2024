
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Pedidos, PedidosItem, Numeracion, sequelize } = require("../database/models");

module.exports = {
  

    createPedido: async (pedidoData, res) => {

        const { TIPO, CLIENTE, NROPED, CODIGO, NROREAL, ESTADOSEG, items } = pedidoData;
        
        const transaction = await sequelize.transaction();



        // Consulta al modelo Numeraciones para obtener el valor de FUNCION
        const numeracion = await Numeracion.findOne({
            where: { CLAVE: 'SI091PD0001X' },
            attributes: ['FUNCION'],
            transaction
        });

        if (!numeracion) {
            throw new Error('Numeracion no encontrada');
        }

        // Asigna el valor de FUNCION a una variable y suma uno a la parte numérica
        let funcion2 = numeracion.FUNCION;
        let funcion3 = numeracion.FUNCION.slice(-8);
        let funcion = funcion2.slice(0, 8);

        // Extraer la parte numérica del string
        const regex = /(\D*)(\d+)(\D*)/;
        const match = funcion.match(regex);

        if (!match) {
            throw new Error('Formato de FUNCION no válido');
        }

        const prefix = match[1]; // Parte no numérica al inicio
        const number = parseInt(match[2], 10); // Parte numérica
        const suffix = match[3]; // Parte no numérica al final

        // Incrementar la parte numérica y reconstruir el string
        const newNumber = number + 1;
        const newNumberStr = newNumber.toString().padStart(match[2].length, '0'); // Mantener el mismo número de dígitos
        const newFuncion = `0001${prefix}${newNumberStr}`.slice(0, 12); // Tomar solo los primeros 8 caracteres

        // Actualizar el valor de FUNCION en la base de datos
        await Numeracion.update({ 
            FUNCION: `${newFuncion}${funcion3}`.slice(4) 
        }, { where: { 
            CLAVE: 'SI091PD0001X' 
        }, 
        transaction });

        //console.log('numero final:'+newFuncion)


        try {
            const pedidos = await Pedidos.create({
                TIPO: 'P',
                CLIENTE,
                NROPED: newFuncion,
                NROREAL: newFuncion,
                ESTADOSEG: 'I',
                CODIGO: '21'
            }, { transaction } );   //

            if (!items || !Array.isArray(items)) {
                throw new Error('items must be an array');
            }

            const pedidositem = await Promise.all(items.map(item => 
                PedidosItem.create({
                    TIPO: 'P',
                    CLIENTE,
                    NROPED: newFuncion,
                    ARTICULO: item.ARTICULO,
                    CANTPED: item.CANTPED,
                    PRECIO: item.PRECIO,
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