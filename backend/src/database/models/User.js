
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "User", 
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            numero_vendedor: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "usuariosweb",
            timestamps: false,   
        }
    );
    return Model;
};


