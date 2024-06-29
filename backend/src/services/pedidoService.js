
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Pedidos, PedidosItem, Numeracion, sequelize } = require("../database/models");
// const { format } = require("date-fns");

module.exports = {
  
    createPedido: async (pedidoData, res) => {

        //const { TIPO, CLIENTE, NROPED, CODIGO, NROREAL, ESTADOSEG, CONDVENTA, DIREENT, PROENT, LOCENT, TELEFONOS, FECTRANS, COMENTARIO, items } = pedidoData;
        console.log('pedidoData:', JSON.stringify(pedidoData, null, 2)); // Log completo del objeto pedidoData
        const { CLIENTE, RAZONSOC, CONDVENTA, DIREENT, PROENT, LOCENT, TELEFONOS, FECTRANS, COMENTARIO, items } = pedidoData;

        // Log de CLIENTE para verificar sus propiedades
        console.log('CLIENTE:', CLIENTE);

        // Verificar que CLIENTE esté definido y tenga las propiedades NUMERO y RAZONSOC
        // if (!CLIENTE.CLIENTE || !CLIENTE.RAZONSOC) {
        //     throw new Error('CLIENTE data is missing or incomplete');
        // }

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

        // const formattedDate = FECTRANS ? format(FECTRANS, 'yyyy-MM-dd HH:mm:ss') : null;

        //console.log('numero final:'+newFuncion)
        // console.log("Fecha formateada2:", formattedDate);

        // try {
            const pedidos = await Pedidos.create({
                TIPO: 'P',
                CLIENTE: CLIENTE,
                RAZONSOC: RAZONSOC,
                CONDVENTA,
                DIREENT,
                PROENT,
                LOCENT,
                TELEFONOS,
                FECTRANS,
                FECEMISION: FECTRANS,
                FECRECEP: FECTRANS,
                FECALTA: FECTRANS,
                COMENTARIO,
                NROPED: newFuncion,
                NROREAL: newFuncion,
                ESTADOSEG: 'I',
                CODIGO: '21'
            }, { transaction });    

            if (!items || !Array.isArray(items)) {
                throw new Error('items must be an array');
            }

            const pedidositem = await Promise.all(items.map(item => 
                PedidosItem.create({
                    TIPO: 'P',
                    CLIENTE: CLIENTE,
                    NROPED: newFuncion,
                    ARTICULO: item.ARTICULO,
                    DESCART: item.DESCART,
                    CANTPED: item.CANTPED,
                    BULTPED: item.CANTPED,
                    PRECIO: item.PRECIO,
                    DESCUENTO: item.DESCUENTO,
                    FECALTA: FECTRANS,
                    ITEM: item.ITEM
                }, { transaction })  
            ));

            await transaction.commit();

            return { pedidos, pedidositem };
        // } catch (error) {
        //          await transaction.rollback();
        //          throw new Error('Error al crear el pedido');
        // }
    }, 


    updatePedido: async(data, NROPED) => {

        const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato yyyy-MM-dd

        // const { NROPED } = req.params;
        const { CLIENTE, RAZONSOC, ENTREGA, LOCENT, PROENT, DIREENT, TELEFONOS, CONDVENTA, FECTRANS, COMENTARIO, pedidoItems } = data;
        const TIPO = 'P';

        try {
            // Transacción para asegurar la atomicidad
            await sequelize.transaction(async (transaction) => {
                
                // Actualizar el pedido principal
                await Pedidos.update({ 
                    CLIENTE: CLIENTE,
                    RAZONSOC: RAZONSOC,
                    DIREENT: DIREENT,
                    LOCENT: LOCENT,
                    TELEFONOS: TELEFONOS,
                    PROENT: PROENT,
                    CONDVENTA: CONDVENTA,
                    FECTRANS: FECTRANS,
                    FECMOD: currentDate,
                    COMENTARIO: COMENTARIO,
                }, {
                    where: { NROPED: NROPED,
                        TIPO: 'P',
                        CODIGO: '21',
                     },
                     transaction });

                // Eliminar ítems antiguos
                await PedidosItem.destroy({ 
                    where: { NROPED: NROPED,
                        TIPO: 'P',
                     }, 
                    transaction });

                const newItems = pedidoItems.map(item => ({
                    NROPED,
                    CLIENTE,
                    TIPO,
                    ITEM: item.ITEM, // Reemplaza ITEM con el nombre de los campos que necesites
                    ARTICULO: item.ARTICULO, // Reemplaza ITEM con el nombre de los campos que necesites
                    DESCART: item.DESCART,
                    CANTPED: item.CANTPED, // Reemplaza CANTIDAD con el nombre de los campos que necesites
                    PRECIO: item.PRECIO, // Reemplaza PRECIO con el nombre de los campos que necesites
                    DESCUENTO: item.DESCUENTO,
                }));

                // Crear ítems nuevos
                // const newItems = pedidoItems.map(item => ({ ...item, NROPED, CLIENTE, TIPO }));

                // console.log("newItems"+newItems)
                // newItems.map((obj, index) => {
                //     console.log(`Objeto ${index + 1}:`, obj);
                //     return null; // No necesitamos retornar nada en particular
                // });
                
                await PedidosItem.bulkCreate(newItems, { transaction });
            });
    
            return true;  // Devolver true si la transacción fue exitosa
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            return false;  // Devolver false si hubo un error
        }
    },

    editPedido: async(NROPED) => {
        // console.log("NROPED SERVICE: "+NROPED)
        // return Pedidos.findByPk(NROPED);
        try {
            const pedido = await Pedidos.findOne({ 
                where: {
                    NROPED,
                    TIPO: 'P',
                    CODIGO: '21',
                }
            });
            return pedido;
        } catch (error) {
             throw new Error('Error al obtener el pedido');
        }
    },

    destroyPedido: (NROPED) => {
        return Pedidos.destroy({
            where: {
                NROPED: NROPED,
                TIPO: 'P',
                CODIGO: '21',
            }
        });
    },

    destroyPedidosItem: (NROPED) => {
        return PedidosItem.destroy({
            where: {
                NROPED: NROPED,
                TIPO: 'P',
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