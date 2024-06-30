
const config = require("./config");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { Sequelize } = require('sequelize');
const CircuitBreaker = require('circuit-breaker-js');

require('dotenv').config();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded( { extended: true }));
app.use(express.json());
app.use(
    cors(
        (corsOptions = {
            origin: "*",
        })
    )
);

console.log(`NODE_ENV=${process.env.NODE_ENV}`);
console.log(`DB_HOST=${process.env.DB_HOST}`);
console.log(`DB_USER=${process.env.DB_USER}`);
console.log(`DB_PASS=${process.env.DB_PASS}`);
console.log(`DB_NAME=${process.env.DB_NAME}`);
console.log(`DB_PORT=${process.env.DB_PORT}`);

const mainRouter = require("./routes/mainRouter");
app.use(mainRouter);

const MAX_RETRIES = 3;
const RETRY_INTERVAL_MS = 5000; // 5 segundos

// Configuración del Circuit Breaker
const circuitBreakerOptions = {
    failureThreshold: 3,    // Número de fallos antes de abrir el Circuit Breaker
    successThreshold: 2,    // Número de éxitos requeridos para cerrar el Circuit Breaker
    timeoutDuration: 5000,  // Tiempo en milisegundos antes de intentar nuevamente en modo semiabierto
    fallback: () => {
        console.log('Circuit breaker fallback: Unable to connect to the database.');
    }
};

const circuitBreaker = new CircuitBreaker(circuitBreakerOptions);

// Initialize Sequelize
function connectDatabase(retries = 0) {
    const sequelize = new Sequelize(
        process.env.DB_NAME, 
        process.env.DB_USER, 
        process.env.DB_PASS,
        {
            dialect: process.env.DB_DIALECT,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            dialectOptions: {
                requestTimeout: 30000 // tiempo en milisegundos
            }
        }
    );

// const sequelize = new Sequelize(
//     process.env.DB_NAME, 
//     process.env.DB_USER, 
//     process.env.DB_PASS, 
//     {
//         host: process.env.DB_HOST,
//         dialect: 'mssql',
//         dialectOptions: {
//             options: {
//                 encrypt: false, // For secure connection, if needed
//                 trustServerCertificate: true // For self-signed certificates
//             }
//     }   
// });
  
// Test the database connection
    // sequelize.authenticate()
    // .then(() => {
    //     console.log('Database connection has been established successfully.');
    // })
    // .catch(err => {
    //     console.error(`Attempt ${retries + 1} - Unable to connect to the database:`, err);
    //     if (retries < MAX_RETRIES - 1) {
    //         // Reintentar la conexión después de RETRY_INTERVAL_MS milisegundos
    //         setTimeout(() => connectDatabase(retries + 1), RETRY_INTERVAL_MS);
    //     } else {
    //         console.error(`Max retries (${MAX_RETRIES}) reached. Exiting application.`);
    //         process.exit(1); // Salir de la aplicación después de alcanzar el máximo de intentos
    //     }
    // });
    // circuitBreaker.run(() => sequelize.authenticate())
    //     .then(() => {
    //         console.log('Database connection has been established successfully.');
    //     })
    //     .catch(err => {
    //         console.error(`Attempt ${retries + 1} - Unable to connect to the database:`, err);
    //         if (retries < MAX_RETRIES - 1) {
    //             // Reintentar la conexión después de RETRY_INTERVAL_MS milisegundos
    //             setTimeout(() => connectDatabase(retries + 1), RETRY_INTERVAL_MS);
    //         } else {
    //             console.error(`Max retries (${MAX_RETRIES}) reached. Exiting application.`);
    //             process.exit(1); // Salir de la aplicación después de alcanzar el máximo de intentos
    //         }
    //     });
    return new Promise((resolve, reject) => {
        sequelize.authenticate()
            .then(() => {
                console.log('Database connection has been established successfully.');
                resolve();
            })
            .catch(err => {
                console.error(`Attempt ${retries + 1} - Unable to connect to the database:`, err);
                reject(err);
            });
    });
}

// Llamar a la función de conexión inicial
//connectDatabase();

//const PORT = 3000;
//app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

connectDatabase()
    .then(() => {
        const PORT = 3000;
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
        process.exit(1); // Salir de la aplicación en caso de error de conexión
    });





