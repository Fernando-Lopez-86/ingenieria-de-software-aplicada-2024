const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded( { extended: false }));
app.use(express.json());

const mainRouter = require("./routes/mainRouter");
app.use(mainRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));