const mongoose = require("mongoose");
const app = require("./app");
//Puerto
const port = process.env.PORT || 3977;
//Version de la API
const { API_VERSION, IP_SERVER, PORT_DB, NAME_DB } = require("./config");

mongoose.set("useFindAndModify", false);

//Conexion a la base de datos con moongose
mongoose.connect(`mongodb://${IP_SERVER}:${PORT_DB}/${NAME_DB}`, {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("La conexion a la base de datos es correcta");

        app.listen(port, () => {
            console.log("#############################");
            console.log("######### API REST ##########");
            console.log("#############################");
            console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
        })
    }
});