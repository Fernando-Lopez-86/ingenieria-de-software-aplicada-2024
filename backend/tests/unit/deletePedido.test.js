const pedidoService = require('../../src/services/pedidoService');
const { sequelize } = require('../../src/database/models');

describe('createPedido function', () => {
    beforeEach(async () => {
        await sequelize.sync(); 
    });

    it('should create a new pedido', async () => {
        const pedidoData = {
            CLIENTE: 2404068,
            RAZONSOC: 'MOLINA ALICIA GRACIELA',
            CONDVENTA: '00',
            DIREENT: 'Dirección de prueba',
            PROENT: 'BA',
            LOCENT: 'Localidad de prueba',
            TELEFONOS: '123456',
            FECTRANS: new Date(),
            FECEMISION: new Date(),
            COMENTARIO: 'Comentario de prueba',
            items: [
                {
                    ARTICULO: '10011472011',
                    DESCART: 'EXP: MARQUES DEL SUR MALBEC 6x1500',
                    CANTPED: 1,
                    PRECIO: 100.00,
                    DESCUENTO: 0,
                    ITEM: '001'
                }
            ]
        };

        const result = await pedidoService.createPedido(pedidoData);

        expect(result).toHaveProperty('pedidos');
        expect(result).toHaveProperty('pedidositem');
    });
});