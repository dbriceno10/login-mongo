const { Router } = require("express");
require("dotenv").config();
const router = Router();
const User = require("../models/User");
const users = require("./users.js");
const {
  redirectLogin,
  redirectHome,
} = require("./controller/utils/middleware");
const { SECCION_NAME } = process.env;
const date = new Date();

///******* TEMPLATES **********/

router.use("/users", users);

router.get("/", (req, res) => {
  const { userId } = req.session;

  res.send(`
    <h1>Bienvenidos!</h1>
    ${
      userId
        ? `
      <a href='/home'>Perfil</a>
      <form method='post' action='/logout'>
        <button>Salir</button>
      </form>
      `
        : `
      <a href='/users/login'>Ingresar</a>
      <a href='/users/register'>Registrarse</a>
      `
    }
  `);
});

router.get("/users/login", redirectHome, (req, res) => {
  res.send(`
    <h1>Iniciar sesión</h1>
    <form method='post' action='/users/login'>
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' />
    </form>
    <a href='/users/register'>Registrarse</a>
  `);
});

router.get("/home", redirectLogin, async (req, res) => {
  const { userId } = req.session;
  const user = await User.findById(userId);

  res.send(`
    <h1>Bienvenido ${user.username}</h1>
    <h4>${user.name} ${user.lastname}</h4>
    <a href='/'>Inicio</a>
    <br/>
    <a href='/users/update'>Actualizar Datos</a>
  `);
});

router.get("/users/register", redirectHome, (req, res) => {
  res.send(`
    <h1>Registrarse</h1>
    
    <form method='post' action='/users/register'>
      <input name='username' placeholder='Nombre de usuario' required />
      <input name="avatar" placeholder="Avatar"/>
      <input name='name' placeholder='Nombre' required />
      <input name='lastname' placeholder='Apellido' required />
      <input type='email' name='email' placeholder='Email' required />
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type="password" name="repitePassword" placeholder="Repetir contraseña" required />
      <input type='submit' />
    </form>
    <a href='/users/login'>Iniciar sesión</a>
  `);
});

router.get("/users/update", redirectLogin, (req, res) => {
  res.send(`
    <h1>Actualziar datos</h1>
    
    <form method='post' action='/users/update'>
      <input name='username' placeholder='Nombre de usuario'/>
      <input name="avatar" placeholder="Avatar"/>
      <input name='name' placeholder='Nombre' />
      <input name='lastname' placeholder='Apellido' />
      <input type='email' name='email' placeholder='Email'/>
      <input type='submit' />
    </form>
    <a href="/users/verifypassword">Cambiar contraseña</a>
    <a href='/home'>Volver al Perfil</a>
  `);
});

router.get("/users/verifypassword", redirectLogin, (req, res) => {
  res.send(`
    <h1>Verificar contraseña</h1>
    
    <form method='post' action='/users/verifypassword'>
      <input type='password' name='password' placeholder='Contraseña' required />
      <input type='submit' />
    </form>
    <a href='/home'>Volver al Perfil</a>
  `);
});

router.get("/users/updatepassword", redirectLogin, (req, res) => {
  res.send(`
    <h1>Actualziar Contraseña</h1>
    
    <form method='post' action='/users/updatepassword'>
      <input type='password' name='newPassword' placeholder='Contraseña' required />
      <input type='password' name='repiteNewPassword' placeholder='Repetir contraseña' required />
      <input type='submit' />
    </form>
    <a href='/home'>Volver al Perfil</a>
  `);
});

router.post("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/home");
    }
    res.clearCookie(SECCION_NAME);
    res.redirect("/");
  });
});

module.exports = router;
