
module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define(
        "Articulos",
        {
            NUMERO:  {
                type: DataTypes.STRING,
                primaryKey: true
            }, 
            DESCRIP: DataTypes.STRING, 
            EQUIVALENC: DataTypes.STRING, 
            AGRUPMIEN: DataTypes.STRING, 
            CODBARRAS: DataTypes.STRING, 
            MARCA: DataTypes.STRING, 
            PROVEEDOR: DataTypes.STRING, 
            FABRICANTE: DataTypes.STRING, 
            PRESVENTA: DataTypes.STRING, 
            PRESCOMPRA: DataTypes.STRING,
            LISTA: DataTypes.STRING, 
            LISTAPRECIO: DataTypes.STRING, 
            DESCUENTO: DataTypes.FLOAT, 
            DESCUENTOESP: DataTypes.FLOAT, 
            IMPUESTOS: DataTypes.STRING,
            GRCOMISION: DataTypes.STRING,         
            TIPO: DataTypes.STRING, 
            ORIGEN: DataTypes.STRING, 
            IRRELEVANT: DataTypes.STRING,
            EXISTENCIA: DataTypes.STRING,
            EXPLOSION: DataTypes.STRING,
            IMPCOMPRA: DataTypes.STRING, 
            IMPVENTA: DataTypes.STRING, 
            CCCOMPRA: DataTypes.STRING, 
            CCVENTAS: DataTypes.STRING, 
            STKMINIMO: DataTypes.FLOAT, 
            STKMAXIMO: DataTypes.FLOAT,
            STKREPOSIC: DataTypes.FLOAT,
            CODTALLE: DataTypes.STRING, 
            PPPML: DataTypes.FLOAT, 
            PPPME: DataTypes.FLOAT, 
            LOTECOMPRA: DataTypes.FLOAT, 
            TIEMPOREP: DataTypes.FLOAT, 
            FECULTVTA: DataTypes.DATE, 
            FECULTCPA: DataTypes.DATE, 
            CANTULTCPA: DataTypes.FLOAT, 
            PRULTCPAML: DataTypes.FLOAT, 
            PRULTCPAME: DataTypes.FLOAT, 
            MARGENCPA: DataTypes.FLOAT,
            INVENTARIO: DataTypes.STRING, 
            PRECIOSTD: DataTypes.FLOAT, 
            PRECIOREP: DataTypes.FLOAT, 
            PPPLBATCH: DataTypes.FLOAT, 
            PPPEBATCH: DataTypes.FLOAT, 
            FECPPBATCH: DataTypes.DATE,
            NROSERIE: DataTypes.STRING, 
            DESPACHO: DataTypes.STRING,
            MODIFDESCR: DataTypes.STRING, 
            IMAGEN: DataTypes.STRING, 
            IMPCOSTVTA: DataTypes.STRING,
            COSCOSTVTA: DataTypes.STRING, 
            FACTURABLE: DataTypes.STRING, 
            GENERAEST: DataTypes.STRING, 
            KIT: DataTypes.STRING,
            FECINHAB: DataTypes.DATE, 
            INHABILITADO: DataTypes.DATE, 
            DOBLEMED: DataTypes.STRING, 
            PARTIDA: DataTypes.STRING, 
            INTERNOFIJO: DataTypes.STRING,
            INTERNOVALOR: DataTypes.FLOAT, 
            POSICIONARAN: DataTypes.STRING,
            FOB: DataTypes.FLOAT, 
            AUXILIAR1: DataTypes.STRING, 
            AUXILIAR2: DataTypes.STRING, 
            AUXILIAR3: DataTypes.STRING, 
            AUXILIAR4: DataTypes.STRING,
            FECALTA: DataTypes.DATE, 
            USUARIO: DataTypes.STRING, 
            FECMOD: DataTypes.DATE,
            USRMOD: DataTypes.STRING, 
            RELACION: DataTypes.STRING, 
            ANCOMPRA: DataTypes.STRING,
            ANVENTAS: DataTypes.STRING,
            ANCOSTVTA: DataTypes.STRING, 
            PESO: DataTypes.FLOAT, 
            VOLUMEN: DataTypes.FLOAT, 
            DECBULTOS: DataTypes.INTEGER,
            DECUNIDADES: DataTypes.INTEGER, 
            NOMMERCOSUR: DataTypes.STRING, 
            CODOTRSIS: DataTypes.STRING, 
            CATALOGO: DataTypes.STRING, 
            COMENTARIO: DataTypes.STRING, 
            IMPVENTAME: DataTypes.STRING, 
            CCVENTASME: DataTypes.STRING, 
            ANVENTASME: DataTypes.STRING,    
            MULTIPLICADOR: DataTypes.FLOAT, 
            LOTEFABRICACION: DataTypes.FLOAT, 
            MERMA: DataTypes.FLOAT, 
            EXCESOOC: DataTypes.FLOAT,

        },
        {
            tableName: "articulo",
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