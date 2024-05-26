
const config = require("./config");
const express = require("express");
const app = express();
const path = require("path");

require('dotenv').config();

console.log(`NODE_ENV=${process.env.NODE_ENV}`);
console.log(`DB_HOST=${process.env.DB_HOST}`);
console.log(`DB_USER=${process.env.DB_USER}`);
console.log(`DB_PASS=${process.env.DB_PASS}`);
console.log(`DB_NAME=${process.env.DB_NAME}`);
console.log(`DB_PORT=${process.env.DB_PORT}`);

const { Sequelize } = require('sequelize');
// const config = require('./database/config/config');

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded( { extended: false }));
app.use(express.json());

const mainRouter = require("./routes/mainRouter");
app.use(mainRouter);


// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS,
    {
        dialect: process.env.DB_DIALECT,
        server: process.env.DB_HOST,
        port: process.env.DB_PORT,
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

// console.log(`NODE_ENV=${process.env.NODE_ENV}`);
// console.log(`DB_HOST=${process.env.DB_HOST}`);
// console.log(`DB_USER=${process.env.DB_USER}`);
// console.log(`DB_PASS=${process.env.DB_PASS}`);
// console.log(`DB_NAME=${process.env.DB_NAME}`);
// console.log(`DB_PORT=${process.env.DB_PORT}`);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));






