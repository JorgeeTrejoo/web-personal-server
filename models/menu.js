//Importamos mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creamos es Schema de nuestro menu
const MenuSchema = Schema({
    title: String,
    url: String,
    order: Number,
    active: Boolean
});

//Lo exportamos para importarlo en nuestra carpeta de controllers/menu.js
module.exports = mongoose.model("Menu", MenuSchema);