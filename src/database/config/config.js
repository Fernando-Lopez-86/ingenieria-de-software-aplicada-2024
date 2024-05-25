
const dotenv = require('dotenv');

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_USER: process.env.DB_USER || 'sa',
    DB_PASS: process.env.DB_PASS || 'Naranja90*',
    DB_NAME: process.env.DB_NAME || 'GRAND_ESTATE',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '14333',
    DB_DIALECT: process.env.DB_DIALECT || "mssql",   
};

