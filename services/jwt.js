const jwt = require("jwt-simple");
const moment = require("moment");

//Creamos una clave secreta para generar el token
const SECRET_KEY = "fgd23dh6ded33UIfre453NYfc464ghyGfbdkjeye";

exports.createAccessToken = function(user){
    const payload = {
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        createToken: moment().unix(),
        exp: moment().add(3, "hours").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.createRefreshToken = function(user){
    const payload = {
        id: user._id,
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, SECRET_KEY);
};

exports.decodedToken = function(token){
    return jwt.decode(token, SECRET_KEY, true);
}