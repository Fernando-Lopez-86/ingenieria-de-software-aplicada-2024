
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Pedidos, PedidosItem, Pedidos_temp, PedidosItem_temp, Numeracion, Numeracion_temp, sequelize } = require("../database/models");

module.exports = {
  
    createPedido: async (pedidoData) => {
        //const { TIPO, CLIENTE, NROPED, CODIGO, NROREAL, ESTADOSEG, CONDVENTA, DIREENT, PROENT, LOCENT, TELEFONOS, FECTRANS, COMENTARIO, items } = pedidoData;
        //console.log('pedidoData:', JSON.stringify(pedidoData, null, 2)); // Log completo del objeto pedidoData
        const { CLIENTE, RAZONSOC, CONDVENTA, DIREENT, PROENT, LOCENT, TELEFONOS, VENDEDOR, FECTRANS, FECEMISION, COMENTARIO, items } = pedidoData;

        const transaction = await sequelize.transaction();

        try {
            // Consulta al modelo Numeraciones para obtener el valor de FUNCION
            const numeracion = await Numeracion_temp.findOne({
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
            await Numeracion_temp.update({ 
                FUNCION: `${newFuncion}${funcion3}`.slice(4) 
            }, { where: { 
                CLAVE: 'SI091PD0001X' 
            }, 
            transaction });

            const pedidos = await Pedidos_temp.create({
                TIPO: 'P',
                CLIENTE: CLIENTE,
                RAZONSOC: RAZONSOC,
                CONDVENTA,
                DIREENT,
                PROENT,
                LOCENT,
                TELEFONOS,
                FECTRANS,
                VENDEDOR: VENDEDOR,
                FECEMISION: FECEMISION,
                FECRECEP: FECEMISION,
                FECALTA: FECEMISION,
                COMENTARIO,
                NROPED: newFuncion,
                NROREAL: newFuncion,
                ESTADOSEG: 'P',
                CODIGO: '21',
                ESTADO: '00'
            }, { transaction });    

            if (!items || !Array.isArray(items)) {
                throw new Error('items must be an array');
            }

            const pedidositem = await Promise.all(items.map(item => 
                PedidosItem_temp.create({
                    TIPO: 'P',
                    CLIENTE: CLIENTE,
                    NROPED: newFuncion,
                    ARTICULO: item.ARTICULO,
                    DESCART: item.DESCART,
                    CANTPED: item.CANTPED,
                    BULTPED: item.CANTPED,
                    PRECIO: item.PRECIO,
                    DESCUENTO: item.DESCUENTO,
                    FECALTA: FECEMISION,
                    ITEM: item.ITEM
                }, { transaction })  
            ));

            await transaction.commit();

            return { pedidos, pedidositem, newFuncion };
        } catch (error) {
                 await transaction.rollback();
                 throw new Error('Error al crear el pedido');
        }
    }, 


    createPedidoCheck: async (pedidoData) => {
        //const { TIPO, CLIENTE, NROPED, CODIGO, NROREAL, ESTADOSEG, CONDVENTA, DIREENT, PROENT, LOCENT, TELEFONOS, FECTRANS, COMENTARIO, items } = pedidoData;
        //console.log('pedidoData:', JSON.stringify(pedidoData, null, 2)); // Log completo del objeto pedidoData
        const { NROPED, CLIENTE, RAZONSOC, CONDVENTA, DIREENT, PROENT, LOCENT, TELEFONOS, VENDEDOR, FECTRANS, FECEMISION, COMENTARIO, pedidoItems } = pedidoData;

        const transaction = await sequelize.transaction();

        try {
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

            // Actualizar el valor de ESTADOSEG
            await Pedidos_temp.update({ 
                ESTADOSEG: 'A'
            }, { where: { 
                NROPED: NROPED,
                CLIENTE: CLIENTE,
                CODIGO: '21',
                TIPO: 'P',
            }, 
            transaction });

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
                VENDEDOR: VENDEDOR,
                FECEMISION: FECEMISION,
                FECRECEP: FECEMISION,
                FECALTA: FECEMISION,
                COMENTARIO,
                NROPED: newFuncion,
                NROREAL: newFuncion,
                ESTADOSEG: 'A',
                CODIGO: '21',
                ESTADO: '00'
            }, { transaction });    

            if (!pedidoItems || !Array.isArray(pedidoItems)) {
                throw new Error('items must be an array');
            }

            const pedidositem = await Promise.all(pedidoItems.map(item => 
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
                    FECALTA: FECEMISION,
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


    updatePedido: async(data) => {
        //console.log('Data:', JSON.stringify(data, null, 2)); // Log completo del objeto pedidoData
        const currentDate = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato yyyy-MM-dd

        // const { NROPED } = req.params;
        const { NROPED, CLIENTE, RAZONSOC, ENTREGA, LOCENT, PROENT, DIREENT, TELEFONOS, CONDVENTA, FECTRANS, COMENTARIO, pedidoItems } = data;
        const TIPO = 'P';

        try {
            // Transacción para asegurar la atomicidad
            await sequelize.transaction(async (transaction) => {
                
                // Actualizar el pedido principal
                await Pedidos_temp.update({ 
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
                await PedidosItem_temp.destroy({ 
                    where: { NROPED: NROPED,
                        TIPO: 'P',
                     }, 
                    transaction });

                    // console.log("item.PRECIO ",pedidoItems)

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

                await PedidosItem_temp.bulkCreate(newItems, { transaction });
            });
    
            return true;  // Devolver true si la transacción fue exitosa
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            return false;  // Devolver false si hubo un error
        }
    },


    editPedido: async(NROPED, numeroVendedor) => {
        // console.log("numeroVendedorrrrrr: "+numeroVendedor)
        // return Pedidos.findByPk(NROPED);
        try {
            const pedido = await Pedidos_temp.findOne({ 
                where: {
                    NROPED,
                    TIPO: 'P',
                    CODIGO: '21',
                    VENDEDOR: numeroVendedor
                }
            });
            return pedido;
        } catch (error) {
             throw new Error('Error al obtener el pedido');
        }
    },


    destroyPedido: async (NROPED, numeroVendedor) => {
        let transaction;
        try {
            // Iniciar una transacción
            transaction = await sequelize.transaction();

            // Primera operación de eliminación dentro de la transacción
            await Pedidos_temp.destroy({
                where: {
                    NROPED: NROPED,
                    TIPO: 'P',
                    CODIGO: '21',
                    VENDEDOR: numeroVendedor
                },
                transaction: transaction // especificar la transacción
            });

            // Segunda operación de eliminación dentro de la transacción
            await PedidosItem_temp.destroy({
                where: {
                    NROPED: NROPED,
                    TIPO: 'P',
                },
                transaction: transaction // especificar la misma transacción
            });

            // Confirmar la transacción si ambas operaciones tienen éxito
            await transaction.commit();

            console.log('Transacción completada exitosamente.');
        } catch (error) {
            // Si hay un error, deshacer la transacción
            if (transaction) {
                await transaction.rollback();
                console.error('Error en la transacción:', error);
                throw error; // opcional: re-lanzar el error para manejarlo más arriba
            }
        }
    },


    deletePedido: (NROPED) => {
        return Pedidos_temp.findByPk(NROPED);
    },


    getAllPedidos: async (numeroVendedor) => {
        if (!numeroVendedor) {
            throw new Error("El valor de numeroVendedor es undefined");
        }

        try {
            // sequelize.options.logging = true;
            const pedidos = await Pedidos_temp.findAll({
                where: {
                    TIPO: 'P',
                    CODIGO: '21',
                    VENDEDOR: numeroVendedor,
                    FECEMISION: {
                        [Op.gte]: new Date('2024-01-01'), // gte = Greater than or equal
                    },
                },
                include: [
                    {
                        model: models.PedidosItem_temp,
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
                    },
                    {
                        model: models.Vendedores,
                        as: 'vendedores',
                        attributes: ['APEYNOM'], // Atributo que queremos incluir
                        required: false, // LEFT OUTER JOIN
                        foreignKey: 'VENDEDOR', // Clave foránea correcta
                    }
                ],
                order: [["NROPED", "ASC"]],
            });

            // Mapea los resultados para agregar el nombre del vendedor en el campo adecuado
            const result = pedidos.map(pedido => {
                return {
                    ...pedido.toJSON(),
                    VENDEDOR: pedido.vendedores ? pedido.vendedores.APEYNOM : null
                };
            });

            return result;
        } catch (error) {
            console.error("Error al obtener los pedidos:", error.message);
            throw error; // Propaga el error para manejo posterior si es necesario
        }
    },


    getAllPedidosItems: (nroped) => {
        return PedidosItem_temp.findAll({ 
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

};