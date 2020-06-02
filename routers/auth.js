const express = require('express');
//Nos traemos de controllers el auth controller
const AuthController = require('../controllers/auth');

//Empezamos a trabajar las rutas
const api = express.Router();

//Creamos el endpoint para refresacar el token, va a ser de tipo post le pasamos la url inventada por nosotros y que de AuthController va ejecutar la funcion refreshAccessToken
api.post("/refresh-access-token", AuthController.refreshAccessToken);

//Exportamos para poder utilizarla, en app.js empezamos a poner las rutas
module.exports = api;
