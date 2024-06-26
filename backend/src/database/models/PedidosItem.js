
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "PedidosItem",
        {
            NROPED: {
                type: DataTypes.STRING,
                primaryKey: true,
            }, 
            CLIENTE: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            TIPO: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            ITEM: {
                type: DataTypes.STRING,
                primaryKey: true,
            }, 
            ARTICULO: DataTypes.STRING, 
            DESCART: DataTypes.STRING, 
            PRESENTA: DataTypes.STRING, 
            LISTA: DataTypes.STRING, 
            DESCUENTO: DataTypes.FLOAT,
            DESCUENTOESP: DataTypes.FLOAT, 
            PRECIO: DataTypes.FLOAT, 
            CANTPED: DataTypes.FLOAT, 
            BULTPED: DataTypes.FLOAT, 
            CANTFRE: DataTypes.FLOAT, 
            BULTFRE: DataTypes.FLOAT, 
            CANTFAC: DataTypes.FLOAT, 
            BULTFAC: DataTypes.FLOAT, 
            CANTREM: DataTypes.FLOAT, 
            BULTREM: DataTypes.FLOAT, 
            CANTARE: DataTypes.FLOAT, 
            BULTARE: DataTypes.FLOAT,
            CANTDTO: DataTypes.FLOAT, 
            DEPSALIDA: DataTypes.STRING, 
            UBICACION: DataTypes.STRING,  
            FECRECEP: DataTypes.DATEONLY, 
            DESPACHO: DataTypes.STRING, 
            CUMPLIDO: DataTypes.STRING, 
            PARTIDA: DataTypes.STRING, 
            FILLER: DataTypes.STRING, 
            USRANULACION: DataTypes.STRING, 
            FECANULACION: DataTypes.DATE,
            FECALTA: DataTypes.DATEONLY, 
            USUARIO: DataTypes.STRING, 
            FECMOD: DataTypes.DATEONLY, 
            USRMOD: DataTypes.STRING, 
            PLANIFICACION: DataTypes.STRING,
        },
        {
            tableName: "pditems",
            timestamps: false,   
        }
    );

    Model.associate = (models) => {
        Model.belongsTo(models.Pedidos, 
            {
                as: 'pedidos',
                foreignKey: {
                    name: 'NROPED',
                    allowNull: false
                },
            },  
        );

        Model.belongsTo(models.Pedidos, 
            {
                as: 'pedidos2',
                foreignKey: {
                    name: 'CLIENTE',
                    allowNull: false
                },
            },
        );

        Model.belongsTo(models.Pedidos, 
            {
                as: 'pedidos3',
                foreignKey: {
                    name: 'TIPO',
                    allowNull: false
                },
            },
        );
    };

    return Model;
};