//Importacion de modulos necesarios
const path = require('path'); 
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session')
const passport = require('passport')
const { client, obtenerAdmin } = require('./database/db');

//Creamos la instancia de la aplicacion Express
const app = express();


//Configuramos la estrategia de autenticación con Google en Passport.
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;


//Configuramos la sesion de Express utilizando el middleware express-sesison
//Middleware
app.use(session({
      secret: "secret",
      resave: false ,
      saveUninitialized: true ,
}))


//Inicializamos passport utilizando el middleware passport.initialize en cada llamada de ruta
app.use(passport.initialize()) 
//Permitimos a passport utilizar express-sesion mediante el middleware passport.session()
app.use(passport.session())    
//Configuramos el motor de plantillas ejs para renderizar las vistas
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : false}))
app.use(express.json()); //este middlewate permite analizar el cuerpo de las solicitudes entrantes en formato json, Analiza automaticamente el cuerpo de las solicitudes y los convierte en objetos javascript accesibles a traves de req.body
app.use(cookieParser()); // permite analizar las cookies de las solicitudes entrantes y hacerlas accesibles a traves de req.cookies
app.use('/',require('./router'));
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

//Obtenemos el ID del cliente y la clave secreta
const GOOGLE_CLIENT_ID = "371491435839-r1ma4need2oitq9p2r7poavhspalc5dv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"


//Puerto
const PORT =  3001;//




//Funcion que será invocada cuando se autentique un usuario. Esta funcion recibe los datos de autenticacion como el token de acceso, actualizacion, perfil de usuario y funcion done para indicar que la autenticacion se ha completado correctamente
authUser = (request, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  
  //Se utiliza GoogleStrategy de passport para configurar la estrategia de autenticacon con google
  passport.use(new GoogleStrategy({
      clientID:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
      passReqToCallback   : true
    }, authUser));
  
  
  //Se define la funcion serializeUser de Passport para serializar al usuario autenticado.
  passport.serializeUser( (user, done) => { 
      console.log(`\n--------> Usuario serializado:`)
      console.log(user)
       // The USER object is the "authenticated user" from the done() in authUser function.
       // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.  
  
      done(null, user)
  } )
  
  //Se define la funcion deserializeUser de Passport para deserializar al usuario autenticado.
  passport.deserializeUser((user, done) => {
          console.log("\n--------- Deserialized User:")
          console.log(user)
          // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
          // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.
          done (null, user)
  }) 

//Definimos la funcion showlogs como middleware para imprimir por consola los valores de req.session y req.user durante el proceso de autenticacion de google
let count = 1
showlogs = (req, res, next) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session.passport)
  
    console.log(`\n req.user -------> `) 
    console.log(req.user) 
  
    console.log("\n Session and Cookie")
    console.log(`req.session.id -------> ${req.session.id}`) 
    console.log(`req.session.cookie -------> `) 
    console.log(req.session.cookie) 
  
    console.log("===========================================\n")

    next()
}

//Utilizamos el middleware para mostrar registros en consola
app.use(showlogs)

//Servidor corriendo en el puerto correspondiente.
app.listen (PORT, ()=>{
      console.log(`Server running on port ${PORT}`)
})