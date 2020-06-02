const jwt = require("jwt-simple");
const moment = require("moment");

//Obtenemos nuestra key es la misma que esta en la carpeta services en el fichero jwt.js
const SECRET_KEY = "fgd23dh6ded33UIfre453NYfc464ghyGfbdkjeye";

exports.ensureAuth = (req, res, next) => {
    //Si viene vacio quiere decir que no viene ningun token
    if(!req.headers.authorization){
        return res.status(403).send({ message: "La petición no tiene cabecera de Autenticación." });
    }

    //Esto cambia el token a vacío
    const token = req.headers.authorization.replace(/['"]+/g, "");

    try {

        var payload = jwt.decode(token, SECRET_KEY);

        if(payload.exp <= moment.unix()){
            //Esto significa que el token ha expirado
            return res.status(404).send({ message: "El token ha expirado" });

        }

    } catch (error) {

        //console.log(error);
        return res.status(404).send({ message: "Token invalido" });
        
    }

    req.user = payload;
    next();
}

/* Nos vamos a user.js que esta en la carpeta routers y requerimos este archivo 
y agregamos [ md_auth.ensureAuth ] en la linea get donde obtenemos los usuarios que quede así
api.get("/users", [ md_auth.ensureAuth ], UseController.getUsers);
*/