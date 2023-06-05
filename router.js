const express = require ('express');
const router = express.Router();
const passport = require('passport');
const client = require('./database/db')



//Home principal
router.get('/', (req,res) => {
  res.render('pages/home')
})

//Login
router.get("/login", (req, res) => {
  res.render("pages/login")
})

//Crear cuenta
router.get("/registro", (req, res) => {
  res.render("pages/registro")
})


//Autenticacion de google:

//Se defina la sig ruta para iniciar el proceso de autenticacion de Google. Se utiliza el metodo passport.authenticate con la estrategia 'google' y se solicita acceso al correo electronico y al perfil del usuario
router.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

//Se define la sig ruta a la que se redirige despues de la autenticacion exitosa o fallida de google. Se utiliza passport.authenticate con la estrategia de google y se configuran las rutas de direccion en caso de exito debe ser homeClient o homeAdmin y en caso de fallo :/login

router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/dashboard' , 
        failureRedirect: '/login'
}));

    

//Se define la sig funcion como middleware para verificar si el usuario esta autenticado. Se utiliza la funcion req.isAuthenticated proporcionada por passport para comprobar si hay una sesión de usuario válida. Si el usuario está autenticado, se pasa al siguiente middleware; de lo contrario, se redirige a la página de inicio de sesión. 
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/login")
}


// Aplica el middleware checkAuthenticated a las rutas que requieran autenticación de usuario administrador
router.get('/homeAdmin',checkAuthenticated, (req,res) => {
 client.query('select * from producto',(error, results)=>{
      if (error){
          throw error;
      }else{
          res.render('pages/admin/homeAdmin', {results:results.rows})
      }
  })
})



router.get('/dashboard', checkAuthenticated,async (req, res) => {
  if (req.isAuthenticated()) {
    // Obtener el perfil del usuario autenticado
    const userProfile = req.user;
    // Consultar la base de datos para verificar si el usuario es administrador
    try {
      const query = 'SELECT admin FROM usuario WHERE mail = $1 and admin = True';
      const values = [userProfile.email];
      const result = await client.query(query, values);
      if (result.rowCount > 0 && result.rows[0].admin) {
        // El usuario autenticado es administrador
        console.log('Usuario administrador')
        return res.redirect('/homeAdmin')
      }else {
        // El usuario autenticado es cliente
        console.log('Usuario cliente');
        return res.redirect('/homeClient');
      }
    } catch (error) {
      console.error('Error al verificar si el usuario es administrador:', error);
    }
  }


  // Redirigir al usuario a la página de inicio de sesión si no está autenticado
  res.redirect('/login');
});

//Se define la ruta /dashboard para mostrar el panel de control del usuario autenticado. Se utiliza el middleware cheackautehnticates para garantizar que el usuario esté autenticado antes de acceder a esta ruta. 
router.get('/homeClient', checkAuthenticated, (req, res) => {
    res.render('pages/client/homeClient', { name: req.user.displayName });
});
    




//ADMIN
//RUTA PARA CREAR ARTICULOS

router.get('/agregarArticulo', (req,res) => {
    res.render('pages/admin/productAdmin/agregarArticulo')
})

//RUTA PARA EDITAR ARTICULOS
/*router.get('/modificarArticulo/:id', (req,res) => {
    res.render('pages/admin/productAdmin/modificarArticulo')
})*/


//CRUD
const crud = require ('./controllers/crud')
router.post ('/save',crud.save)



module.exports = router;



