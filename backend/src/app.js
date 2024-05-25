const express = require("express");
const app = express();
const path = require("path");

require('dotenv').config();

const { Sequelize } = require('sequelize');
const config = require('./database/config/config');

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded( { extended: false }));
app.use(express.json());

const mainRouter = require("./routes/mainRouter");
app.use(mainRouter);


// Initialize Sequelize
const sequelize = new Sequelize(
    config.DB_NAME, 
    config.DB_USER, 
    config.DB_PASS,
    {
        dialect: config.DB_DIALECT,
        server: config.DB_HOST,
        port: config.DB_PORT,
    }
);
  
// Test the database connection
sequelize
.authenticate()
.then(() => {
    console.log('Database connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

console.log(`NODE_ENV=${config.NODE_ENV}`);
console.log(`DB_HOST=${config.DB_HOST}`);
console.log(`DB_USER=${config.DB_USER}`);
console.log(`DB_PASS=${config.DB_PASS}`);
console.log(`DB_NAME=${config.DB_NAME}`);
console.log(`DB_PORT=${config.DB_PORT}`);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));






