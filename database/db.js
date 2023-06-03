const { Client } = require('pg'); //desestructura el objeto, requiere el modulo de postgres



//Configuramos la conexion con la BBDD
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'TP-FINAL-TALLER',
    password: '43679566',
    port: 5432
});



//Hacemos la conexion 
client.connect((error) =>{
    if (error){
        console.error("El error de conexión es: ", error)
        return
    }
    console.log("¡Conectado a la BD de postgreSQL!")
})



module.exports = client;
