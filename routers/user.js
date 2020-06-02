const express = require("express");
const UseController = require("../controllers/user");
const multipart = require("connect-multiparty");

const md_auth = require("../middlewares/authenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });


const api = express.Router();

api.post("/sign-up", UseController.signUp);
api.post("/sign-in", UseController.signIn);
api.get("/users", [ md_auth.ensureAuth ], UseController.getUsers); //El middleware lo ponemos para decirle que esta url esta protegida solo para usuarios logeados
api.get("/users-active", [ md_auth.ensureAuth ], UseController.getUsersActive); //El middleware lo ponemos para decirle que esta url esta protegida solo para usuarios logeados
//Ruta para cambiar de avatar y le mandamos por parametro el id del usuario, tenemos que tener instalado el siguiente pauqete "connect-multiparty" package.json
api.put("/upload-avatar/:id", [md_auth.ensureAuth, md_upload_avatar], UseController.uploadAvatar);

module.exports = api;