

module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "Pedidos",
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
            CODIGO: DataTypes.STRING,
            FECEMISION: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: 'FECEMISION',
            },	
            FECRECEP: DataTypes.DATEONLY,		
            CONDVENTA: DataTypes.STRING,	
            ACTUALIZA: DataTypes.FLOAT,	
            BONIFICA1: DataTypes.FLOAT,		
            BONIFICA2: DataTypes.FLOAT,		
            BONIFICAESP: DataTypes.FLOAT,		
            VENDEDOR: DataTypes.STRING,
            TRANSPORTE: DataTypes.STRING,
            REFERENCIA: DataTypes.STRING,
            CONGELA: DataTypes.STRING,	
            ENTREGA: DataTypes.STRING,
            MONEDAINGR: DataTypes.STRING,	
            MONEDAEMIS: DataTypes.STRING,	
            ESTADO: DataTypes.STRING,	
            FECTRANS: DataTypes.DATEONLY,	
            OPERACION: DataTypes.STRING,	
            PEDREM: DataTypes.STRING,
            PEDREMREAL: DataTypes.STRING,
            FACTURA: DataTypes.STRING,
            RAZONSOC: DataTypes.STRING,	
            DIRECCION: DataTypes.STRING,
            LOCALIDAD: DataTypes.STRING,
            CODPOSTAL: DataTypes.STRING,
            PROVINCIA: DataTypes.STRING,
            PAIS: DataTypes.STRING,
            CUIT: DataTypes.STRING,	
            IGRBRT: DataTypes.STRING,
            CONGELACOT: DataTypes.STRING,	
            COTIZACION: DataTypes.FLOAT,	
            FILLER: DataTypes.STRING,
            FECALTA: DataTypes.NOW,		
            USUARIO: DataTypes.STRING,	
            FECMOD: DataTypes.DATEONLY,		
            USRMOD: DataTypes.STRING,
            USRANULACION: DataTypes.STRING,	
            FECANULACION: DataTypes.DATEONLY,		
            MOTANULACION: DataTypes.STRING,	
            COMENTARIO: DataTypes.STRING,	
            ENTREGARNG: DataTypes.STRING,	
            DIREENT: DataTypes.STRING,
            LOCENT: DataTypes.STRING,
            CPOENT: DataTypes.STRING,	
            PROENT: DataTypes.STRING,
            PAISENT: DataTypes.STRING,	
            DISENT: DataTypes.STRING,
            NROREAL: {
                type: DataTypes.STRING,
                allowNull: false,
            },	
            MOTIVO: DataTypes.STRING,	
            TELEFONOS: DataTypes.STRING,
            BULTOSEMP: DataTypes.INTEGER, 
            PROXLLAMADA: DataTypes.DATEONLY,	
            ESTADOSEG: DataTypes.STRING,	
            MOTIVOBONIFICACIONES: DataTypes.STRING,	
        },
        {
            tableName: "pdcabeza",
            timestamps: false,   
        }
    );

    Model.associate = (models) => {
        Model.hasMany(models.PedidosItem, 
            {
                as: 'pedidositem',
                foreignKey: {
                    name: 'NROPED',
                    allowNull: false
                },
            },
        );
           
        Model.hasMany(models.PedidosItem, 
            {
                as: 'pedidositem2',
                foreignKey: {
                    name: 'CLIENTE',
                    allowNull: false
                },
            },
        );

        Model.hasMany(models.PedidosItem, 
            {
                as: 'pedidositem3',
                foreignKey: {
                    name: 'TIPO',
                    allowNull: false
                },
            },
        );

        Model.belongsTo(models.Clientes, 
            {
                as: 'clientes',
                foreignKey: {
                    name: 'CLIENTE',
                    allowNull: false
                },
            },
        );

    };
    return Model;
};