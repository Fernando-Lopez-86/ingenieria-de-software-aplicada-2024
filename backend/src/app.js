
const config = require("./config");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const { Sequelize } = require('sequelize');
const CircuitBreaker = require('opossum');

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
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
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

// Initialize Sequelize
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


const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000; // 5 segundos

const circuitOptions = {
    timeout: 30000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
};

async function connectToDatabase() {
    return sequelize.authenticate();
}

const breaker = new CircuitBreaker(connectToDatabase, circuitOptions);

// La función intenta autenticarse con la base de datos.
// Si falla, incrementa el contador de reintentos y vuelve a intentar después de un intervalo especificado.
// Si se alcanzan los máximos reintentos, la aplicación se cierra.
function connectDatabase() {
    return new Promise((resolve, reject) => {
        let attempts = 0;

        const tryConnect = () => {
            breaker.fire()
                .then(() => {
                    console.log('Database connection has been established successfully.');
                    resolve();
                })
                .catch(err => {
                    attempts++;
                    console.error(`Attempt ${attempts} - Unable to connect to the database:`, err);
                    if (attempts < MAX_RETRIES) {
                        console.log(`Retrying in ${RETRY_INTERVAL_MS / 1000} seconds...`);
                        setTimeout(tryConnect, RETRY_INTERVAL_MS);
                    } else {
                        console.error(`Max retries (${MAX_RETRIES}) reached. Exiting application.`);
                        reject(err);
                        process.exit(1);
                    }
                });
        };
        tryConnect();
    });
}

// Se intenta conectar a la base de datos al inicio y, si es exitoso, se inicia el servidor.
connectDatabase()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
        process.exit(1); // Salir de la aplicación en caso de error de conexión
    });





