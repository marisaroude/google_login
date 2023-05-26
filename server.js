require('dotenv').config()//


const cookieParser = require('cookie-parser');
const express = require ('express');
const app = express();


//Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = ''
const client = new OAuth2Client(CLIENT_ID);


const PORT =  5000;//

//Middleware
app.set('view engine', 'ejs'); // configura el motor de plantillas ejs para renderizarlas cistas, especificamente se establece ejs como el motor de plantillas predeterminado
app.use(express.json()); //este middlewate permite analizar el cuerpo de las solicitudes entrantes en formato json, Analiza automaticamente el cuerpo de las solicitudes y los convierte en objetos javascript accesibles a traves de req.body
app.use(cookieParser()); // permite analizar las cookies de las solicitudes entrantes y hacerlas accesibles a traves de req.cookies
app.use(express.static('public'));// sirve archivos estaticos desde el directorio 'public' en tu app. esto significa q os archivos en ese directorio estaran disponibles de manera estatica y se pueden acceder directamente desde el navegador

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/login', (req,res) =>{
    res.render('login')
    
})



app.post('/login', async (req, res) => {
  
/*
  Verificacionesw de cookie y token no me funcionan!

  const csrfTokenCookie = req.cookies.g_csrf_token;
  if (!csrfTokenCookie) {
    console.log(csrfTokenCookie)
    return res.status(400).send('No CSRF token in Cookie.');
    
  }

  const csrfTokenBody = req.body.g_csrf_token;
  if (!csrfTokenBody) {
    console.log(csrfTokenBody)
    return res.status(400).send('No CSRF token in post body.');
  }
  */
  
  
  

  async function verify() {
    /*const token = req.credential.g_csrf_token;
    console.log(token)
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      // Invalid ID token
      console.log('token')
      return res.redirect('/');
    }*/


    // Realiza la autenticación del usuario si es necesario
    // (Dependiendo de cómo esté configurada tu aplicación de autenticación)
    // auth().login(user);

    return res.redirect('/profile');
  }

  try {
    await verify();
  } catch (error) {
    console.error(error);
    return res.redirect('/');
  }
});



app.get('/protectedRoute',(req,res) =>{
  res.send('this route is protected');
})

app.get('/logout', (req,res) =>{
    res.clearCookie('session-token')
    res.redirect('/login');
    
})

app.get('/profile', (req, res) => {
    res.render('profile');
  });


app.listen (PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})



