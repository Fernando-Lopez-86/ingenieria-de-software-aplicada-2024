
const { Op, Association } = require("sequelize");
const models = require("../database/models");
const { Pedidos, PedidosItem, sequelize } = require("../database/models");

module.exports = {
  
    createProduct: (data, file) => {
        return Productos.create({
           sku: data.sku,
           nombre: data.nombre,
           descripcion: data.descripcion,
           precio: data.precio,
           descuento: data.descuento,
           oferta: data.oferta,
           ancho: data.ancho,
           alto: data.alto,
           profundidad: data.profundidad,
           peso: data.peso,
           imagen: file.filename,
           marca_id: data.marca_id,
           categoria_id: data.categoria_id
        });
    },

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


    updateProduct: (data, file, id) => {
        return Productos.update({
            sku: data.sku,
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            descuento: data.descuento,
            oferta: data.oferta,
            ancho: data.ancho,
            alto: data.alto,
            profundidad: data.profundidad,
            peso: data.peso,
            imagen: file ? file.filename : data.imagen,
            marca_id: data.marca_id,
            categoria_id: data.categoria_id
        }, {
            where: {
                id: id
            }
        });
    },

    editProduct: (id) => {
        return Productos.findByPk(id);
    },

    destroyProduct: (id) => {
        return Productos.destroy({
            where: {
                id: id
            }
        });
    },

    deleteProduct: (id) => {
        return Productos.findByPk(id);
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


    getAllPedidos: () => {
       
        return Pedidos.findAll({ 
            where: {
                TIPO: 'P',
                CODIGO: '21',
                FECEMISION: {
                    [Op.gte]: new Date('2024-01-01'),   //gt = Greater than operacion de compracion nativa de sequelize
                },
            },

            //include: ['pedidositem', 'clientes'],  //esta linea agrega los LEFT OUTER JOIN
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