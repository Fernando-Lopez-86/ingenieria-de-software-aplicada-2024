const { Pedidos } = require("../database/models");
const { Op } = require("sequelize");

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

    getAllProducts: () => {
        // return Pedidos.findAll({ include: ['categorias', 'marcas'] });  // include: ["categoria", "marca"] hace referencia al alias de la asociaciones entre las claves foraneas de las tablas
        return Pedidos.findAll();
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