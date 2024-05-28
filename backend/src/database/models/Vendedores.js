
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "Vendedores",
        {
            NUMERO:  {
                type: DataTypes.STRING,
                primaryKey: true
            }, 
            APEYNOM: DataTypes.STRING, 
            MAXDESC: DataTypes.FLOAT, 
            MODIFPREC: DataTypes.STRING, 
            CALCVTAS: DataTypes.STRING, 
            CALCCOB: DataTypes.STRING, 
            COMISVTA: DataTypes.FLOAT, 
            COMISCOB: DataTypes.FLOAT, 
            GRUPO1: DataTypes.FLOAT, 
            GRUPO2: DataTypes.FLOAT, 
            GRUPO3: DataTypes.FLOAT, 
            GRUPO4: DataTypes.FLOAT, 
            GRUPO5: DataTypes.FLOAT, 
            GRUPO6: DataTypes.FLOAT, 
            GRUPO7: DataTypes.FLOAT, 
            GRUPO8: DataTypes.FLOAT, 
            GRUPO9: DataTypes.FLOAT, 
            FECALTA: DataTypes.DATE, 
            USUARIO: DataTypes.STRING,
            FECMOD: DataTypes.DATE, 
            USRMOD: DataTypes.STRING, 
            DEPOSITO: DataTypes.STRING,
            FECINHAB: DataTypes.DATE,

        },
        {
            tableName: "vendedores",
            timestamps: false,   
        }
    );

    Model.associate = (models) => {
        // Model.hasMany(models.Pedidos, {
        //     as: 'pedidos',
        //     foreignKey: 'CLIENTE',
        // });
 
        // Model.belongsTo(models.Categorias, {
        //     as: 'categorias',
        //     foreignKey: 'categoria_id',
        // });
    };

    return Model;
}