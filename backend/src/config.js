const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV == 'development') {
    dotenv.config({ path: path.resolve(__dirname, '../.env.development')});
} else if (process.env.NODE_ENV == 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../.env.production')});
} else if (process.env.NODE_ENV == 'test') {
    dotenv.config({ path: path.resolve(__dirname, '../.env.test')});
}

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT,
    // use_env_variable: process.env.DATABASE_URL,
}
