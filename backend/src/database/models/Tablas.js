module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "Tablas",
        {
            CLAVE:  {
                type: DataTypes.STRING,
                primaryKey: true
            }, 
            FUNCION: DataTypes.STRING,  
            ALFA01: DataTypes.STRING, 
            ALFA02: DataTypes.STRING,
            ALFA03: DataTypes.STRING, 
            ALFA04: DataTypes.STRING,
            ALFA05: DataTypes.STRING, 
            ALFA06: DataTypes.STRING, 
            ALFA07: DataTypes.STRING, 
            ALFA08: DataTypes.STRING, 
            ALFA09: DataTypes.STRING, 
            ALFA10: DataTypes.STRING, 
            ALFA11: DataTypes.STRING, 
            ALFA12: DataTypes.STRING, 
            ALFA13: DataTypes.STRING, 
            ALFA14: DataTypes.STRING, 
            ALFA15: DataTypes.STRING, 
            NUME01: DataTypes.FLOAT, 
            NUME02: DataTypes.FLOAT, 
            NUME03: DataTypes.FLOAT, 
            NUME04: DataTypes.FLOAT, 
            NUME05: DataTypes.FLOAT, 
            NUME06: DataTypes.FLOAT, 
            NUME07: DataTypes.FLOAT, 
            NUME08: DataTypes.FLOAT,
            NUME09: DataTypes.FLOAT, 
            NUME10: DataTypes.FLOAT,
        },
        {
            tableName: "tablas",
            timestamps: false,   
        }
    );

    return Model;
}