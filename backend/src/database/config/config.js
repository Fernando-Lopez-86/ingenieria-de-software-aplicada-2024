
// const dotenv = require('dotenv').config();
//require('dotenv').config() ////OJO SE AGREGA DESPUES

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    },
    test: {
        username: 'sa',
        password: 'Naranja90*',
        database: 'GRAND_ESTATE',
        server: 'localhost',
        port: 1433,
        dialect: 'mssql',
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
    }
};

