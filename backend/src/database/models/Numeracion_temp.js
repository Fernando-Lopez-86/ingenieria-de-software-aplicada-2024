module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "Numeracion_temp",
        {
            CLAVE:  {
                type: DataTypes.STRING,
                primaryKey: true
            }, 
            FUNCION: DataTypes.STRING, 

        },
        {
            tableName: "tablasi09_temp",
            timestamps: false,   
        }
    );

    return Model;
}