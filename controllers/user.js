const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");

//Endpoint para registrar usuario
function signUp(req, res){

    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;

    //Condiciones para los password
    if(!password || !repeatPassword){
        res.status(404).send({message: "Las contrseñas son obligatorias"});
    }else{
        if(password !== repeatPassword){
            res.status(404).send({message: "Las contrseñas deben ser iguales"});
        }else{
            //Encriptamos la contraseña
            bcrypt.hash(password, null, null, function(err, hash) {
                if(err){
                    res.status(500).send({message: "Errro al encriptar el password"})
                }else{
                    user.password = hash;

                    //Esta todo correctamente guardamos en la base de datos
                    user.save((err, userStored ) => {
                        if(err){
                            res.status(500).send({message: "El email ya existe"});
                        }else{
                            if(!userStored){
                                res.status(404).send({message: "Error al crear el usuario"});
                            }else{
                                res.status(200).send({user: userStored});
                            }
                        }
                    })
                }
            })
        }
    }

}

//Endpoint para login
function signIn(req, res){
    const params = req.body;
    //Formateamos siempre el email a minusculas con toLowerCase
    const email = params.email.toLowerCase();
    const password = params.password;

    //Ponemos findOne para que nos busque un usuario y le pasamos el parametro por el cual lo buscara
    //Luego le damos una función de flecha y le damos el error y el userStored en donde se va a guardar el usuario si existe
    User.findOne({email}, (err, userStored) => {
        if(err){
            res.status(500).send({message: "Error del servidor"});
        }else{
            //Si el usuario no existe es porque no se ha encontrado ese usuario
            if(!userStored){
                res.status(404).send({message: "El usuario no existe"});
            }else{
                //Comparamos las contraseñas bcrypt tiene una funcion compare() la cual compara una contraseña encriptada con una no encriptada
                bcrypt.compare(password, userStored.password, (err, correctPassword) => {
                    if(err){
                        res.status(500).send({message: "Error del servidor"});
                    }else if(!correctPassword){
                        //Si correctPassword es false entonces el password no es igual
                        res.status(404).send({message: "El password es incorrecto"});
                    }else{
                        //Checamos que el usuario este activo si no no podra logearse
                        if(!userStored.active){
                            res.status(200).send({code: 200, message: "Usuario inactivo"});
                        }else{
                            //Siempre lo que va adentro de .send() es lo que le mandamos al frontend, entonces si el usuario esta activo y el password coincide le mandamos el accestoken y el refreshtoken que esas funciones las traemos de jwt.js de la carpeta services
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                })
                
            }
        }
    });
}

//Funcion para traer todos los usuarios
function getUsers(req, res){
    //console.log("Get users");
    //Esto nos devolvera todos los usuarios
    User.find().then(users => {
        if(!users){
            //Si viene vacío devolvemos lo siguiente
            res.status(404).send({ message: "No se ha encontrado ningun usuario" });
        }else{
            //Si todo salio correctamente devolvemos los usuarios
            res.status(200).send({ users });
        }
    })
}

//Funcion para traer todos los usuarios ACTIVOS
function getUsersActive(req, res){
    console.log(req);
    const query = req.query;
    //console.log("Get users");
    //Esto nos devolvera todos los usuarios activos 
    User.find({ active: query.active }).then(users => {
        if(!users){
            //Si viene vacío devolvemos lo siguiente
            res.status(404).send({ message: "No se ha encontrado ningun usuario" });
        }else{
            //Si todo salio correctamente devolvemos los usuarios
            res.status(200).send({ users });
        }
    })
}

//Función para subir la foto del avatar al servidor
function uploadAvatar(req, res){

    //Para checar que este funcionando correctamente la funcion en el postman ponemos de tipo puth y mandamos http://localhost:3977/api/v1/upload-avatar/5ecf2ce4bdb97415f744a1fe como parametro el id y en el postman en Headers ponemos Authorization y ponemos el accessToken si esta funcionando correctamente en la consola del server se debe ver el mensaje de uploadAvatar que estamos mandando por consola
    //console.log("uploadAvatar");

    //Parametros porque mandaremos el id del usuario
    const params = req.params;

    //Le decimos que tiene que buscar el usuario que tiene este id que se lo estamos mandando por paramtro y esto devuelve o un error porque no le encuentra o un usario que si encontro
    User.findById({ _id: params.id }, (err, userData) => {
        if(err){
            //Si existe error es porque hay un error del servidor
            res.status(500).send({ message: "Error del servidor" });
        }else{
            if(!userData){
                //No se ha enctroado ningun usuario
                res.status(404).send({ message: "No se ha encontrado ningún usuario" });
            }else{
                //Se ha encontrado un usuario y se hace todo el proceso
                let user = userData;

                console.log(user);
                console.log(req.files);

                //Para que el tema del fichero funcione tenemos que importar el     [const fs = require("fs");] y el [const path = require("path");] solo importarlos sin instalar nada

            }
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar
};