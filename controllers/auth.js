const jwt = require('../services/jwt');
const moment = require('moment');
const User = require('../models/user');

//Funcion para checar si el token ha expirado
function willExpireToken(token){
    const { exp } = jwt.decodedToken(token);
    //Sacamos la fecha actual en unix
    const currentDate = moment().unix();

    //Si curentDate es mayor a exp significa que el token a caducado retonramos un true si aun esta vigente retonramos un false que no a expirado
    if(currentDate > exp){
        return true;
    }

    return false;
}

//Función para refrescar el accesToken
function refreshAccessToken(req, res){
    const { refreshToken } = req.body;
    //Comprobamos en consola que nos devuelva el token
    //console.log(isTokenExpired);
    const isTokenExpired = willExpireToken(refreshToken);
    //Comporbamos en consola si nos devuelve false o true para saber si a caducado
    //console.log(isTokenExpired);

    //isTokenExpired es true entonces a caducado y mandamos mensaje
    if(isTokenExpired){
        res.status(404).send({message: "El refreshToken ha expirado"});
    }else{
        //Hacemos destructury para sacar el id del usuario del refreshToken
        const { id } = jwt.decodedToken(refreshToken);
        //Buscamos el usuario por id, id tiene que ser igual al del usuario
        User.findOne({_id: id}, (err, userStored) => {
            //Si err existe entonces ha dado un error
            if(err){
                res.status(500).send({ message: "Error del servidor" });
            }else{

                //Todo ha salido correctamente
                //Hacemos otra condicion donde diga si userStored no existe quiere decir que no hay ningun usuario con ese id
                if(!userStored){
                    res.status(404).send({ message: "Usuario no encontrado" });
                }else{

                    //Si todo a salido correctamente y el usuario existe entonces retornamos el nuevo token
                    res.status(200).send({ 
                        accessToken: jwt.createAccessToken(userStored),
                        refreshToken: refreshToken
                    });

                }
            }
        })
    }
}

//Ya tenemos nuestra función exportada entonces ahora tenemos que crear la ruta en routers auth.js
module.exports = {
    refreshAccessToken
}