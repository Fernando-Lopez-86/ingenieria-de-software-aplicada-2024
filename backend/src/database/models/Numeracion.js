module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "Numeracion",
        {
            CLAVE:  {
                type: DataTypes.STRING,
                primaryKey: true
            }, 
            FUNCION: DataTypes.STRING, 

        },
        {
            tableName: "tablasi09",
            timestamps: false,   
        }
    );


    return Model;
}