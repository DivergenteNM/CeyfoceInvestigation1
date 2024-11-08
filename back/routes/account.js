var express = require('express');// Importa el módulo 'express', que es un framework para construir aplicaciones web en Node.js.
var router = express.Router();// Crea un nuevo enrutador de Express, que se utiliza para definir rutas en la aplicación.
const UserAdmin = require('../models/userAdmin');// Importa el modelo 'UserAdmin' desde el archivo '../models/userAdmin'. Este modelo probablemente define la estructura y métodos para los administradores de usuarios.
const UserStudent = require('../models/userStudent');// Importa el modelo 'UserStudent' desde el archivo '../models/userStudent'. Este modelo probablemente define la estructura y métodos para los estudiantes usuarios.
const key = require('../token/key');// Importa una clave o configuración relacionada con tokens desde el archivo '../token/key'.
const jwt = require('jsonwebtoken');// Importa el módulo 'jsonwebtoken', que se utiliza para crear y verificar JSON Web Tokens (JWT).
var bcrypt = require('bcryptjs');// Importa el módulo 'bcryptjs', que se utiliza para encriptar y comparar contraseñas de manera segura.
const random = require('string-random');// Importa el módulo 'string-random', que se utiliza para generar cadenas aleatorias.
const sendEmailCode = require('./sendEmail');// Importa una función o módulo para enviar correos electrónicos desde el archivo './sendEmail'.
const multer = require('multer');// Importa el módulo 'multer', que se utiliza para manejar la carga de archivos en aplicaciones Node.js.
const storage = multer.memoryStorage();// Configura 'multer' para almacenar archivos en la memoria en lugar de en el disco.
const upload = multer({ storage: storage });// Crea una instancia de 'multer' con la configuración de almacenamiento en memoria.
const firebase = require('./firebase');// Importa una configuración o instancia de Firebase desde el archivo './firebase'.
const { uuid } = require('uuidv4');// Importa la función 'uuid' desde el módulo 'uuidv4', que se utiliza para generar identificadores únicos universales (UUID).

/* GET home page. */
/*
Definición de la Ruta: Se define una ruta POST para /login.
Extracción de Datos: Se extraen email y password del cuerpo de la solicitud (req.body).
Inicialización de Variables: Se inicializa passwordVerify como false.
Búsqueda de Usuario:
Se busca un usuario administrador (UserAdmin) con el email proporcionado.
Si no se encuentra, se busca un usuario estudiante (UserStudent) con el mismo email.
Si ocurre un error durante la búsqueda, se envía una respuesta con un estado 500 y un mensaje de error.
Verificación de Usuario:
Si se encuentra un usuario (user !== null), se procede con la lógica adicional (no visible en el fragmento proporcionado).
*/
router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;
  var passwordVerify = false;
  var user = await UserAdmin.findOne({ email: email }).catch(err => res.status(500).send("Base de datos desconectada"));
  if (user === null) {
    user = await UserStudent.findOne({ email: email }).catch(err => res.status(500).send("Base de datos desconectada"));
  }
  if (user !== null) {
    passwordVerify = await bcrypt.compare(password, user.password);
    if (passwordVerify) {
      if (user.emailVerify === '') {
        const token = jwt.sign({ id: user._id }, key.secret, {
          expiresIn: '4h'
        });
        var admissibleness = '';
        if (user.role === "SpAdmin") {
          admissibleness = "6465asd7#asd-1";
        } else if (user.role === "Admin") {
          admissibleness = "8435dpe1+nrs-3";
        } else if (user.role === "Ally") {
          admissibleness = "1201fpj4/tmq-1";
        } else if (user.role === "student") {
          admissibleness = "sl34mdms#fgd-6";
        }
        if (admissibleness === '') {
          res.status('200').json({ 'name': user.name })
        } else {
          res.status('200').json({ 'auth': token, 'admissibleness': admissibleness, 'name': user.name })
        }
      } else {
        res.status('403').json({ 'message': 'Email no verificado', 'email': user.email });
      }
    } else {
      res.status('403').json({ 'message': 'Contraseña incorrecta' });
    }
  } else {
    res.status('403').json({ 'message': 'Usuario no registrado' });
  }
});

// está parte es para la carga de imágenes
// se recibe un archivo y se sube a Firebase Storage
// se envía la URL de la imagen subida
router.post('/uploadImage', upload.single('file'), async function (req, res) {
  const blob = firebase.bucket.file(Date.now() + '-' + req.file.originalname)
  const uuidVar = uuid();
  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuidVar
      }
    }
  })
  blobWriter.on('error', (err) => {
    console.log("error");
    console.log(err)
  })
  blobWriter.on('finish', () => {
    var url = `https://firebasestorage.googleapis.com/v0/b/${firebase.bucket.name}/o/${blob.name}?alt=media&token=${uuidVar}`;
    res.status(200).send({ "file": url })
  })
  blobWriter.end(req.file.buffer)
  // res.status('200').json(req.file);
});

router.post('/register/student', async function (req, res, next) {
  const { name, age, sex, course, residenceSector, institution, email, password, file } = req.body;
  const userExist = await UserStudent.find({ email });
  if (userExist.length === 0) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var emailVerify = random(6, { letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' });
    sendEmailCode(email, emailVerify, "code");
    const newStudent = new UserStudent({ name, age, sex, course, residenceSector, institution, email, password: hash, emailVerify, file });
    //var salt = bcrypt.genSaltSync(10);
    //var hash = bcrypt.hashSync('temp1', salt);
    //const newStudent = new UserStudent({name,age,sex,course,residenceSector,institution,email,password,role:'student',emailVerify:'',file});
    const user = await newStudent.save();
    const token = jwt.sign({ id: user._id }, key.secret, {
      expiresIn: '4h'
    });
    var admissibleness = "sl34mdms#fgd-6";
    res.status('200').json({ 'auth': token, 'admissibleness': admissibleness, 'name': user.name })
    // res.status('200').json({'info':"Usuario creado"});
  } else {
    res.status('200').json({ 'info': "Usuario ya existe" });
  }
});


// está parte es para el registro de administradores
// se envía un correo con un código de verificación
// se recibe el código de verificación y se compara con el código enviado
// si es correcto se elimina el código de verificación y se confirma el correo
// si es incorrecto se envía un mensaje de error
// si el usuario no existe se envía un mensaje de error
router.post('/register/other', async function (req, res, next) {
  const { name, email, password, institution } = req.body;
  const userExist = await UserAdmin.find({ email });
  if (userExist.length === 0) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    /**
     * Genera una cadena aleatoria de 6 caracteres para la verificación de correo electrónico.
     * La cadena incluye letras mayúsculas, letras minúsculas y dígitos.
     * @type {string}
     */
    var emailVerify = random(6, { letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' });
    sendEmailCode(email, emailVerify, "code");
    const newAdmin = new UserAdmin({ name, email, password: hash, institution, emailVerify });
    await newAdmin.save();
    res.status('200').json({ 'info': "Usuario creado" })
  } else {
    res.status('200').json({ 'info': "Usuario ya existe" })
  }
});


// está parte es para la verificación de correo electrónico
// se envía un correo con un código de verificación
// se recibe el código de verificación y se compara con el código enviado
// si es correcto se elimina el código de verificación y se confirma el correo
// si es incorrecto se envía un mensaje de error
// si el usuario no existe se envía un mensaje de error
router.post('/confirmation', async function (req, res, next) {
  const { email, codeConfirmation } = req.body;
  var type = false;
  var userExist = await UserStudent.find({ email });
  if (userExist.length === 0) {
    type = true;
    userExist = await UserAdmin.find({ email });
  }
  if (userExist.length > 0) {
    var result;
    if (userExist[0].emailVerify === codeConfirmation) {
      if (type === false) {
        result = await UserStudent.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { emailVerify: '' } })
      } else {
        result = await UserAdmin.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { emailVerify: '' } })
      }
      if (result) {
        res.status('200').json({ 'message': "Email confirmado" })
      } else {
        res.status('403').json({ 'message': "Error" })
      }
    } else {
      res.status('403').json({ 'message': "Código incorrecto" })
    }
  } else {
    res.status('403').json({ 'message': "Usuario no existe" })
  }
});


// está parte es para el reenvío de correo electrónico
// se envía un correo con un nuevo código de verificación
// si el usuario no existe se envía un mensaje de error
router.post('/resend', async function (req, res, next) {
  const { email } = req.body;
  var userExist = await UserStudent.find({ email });
  if (userExist.length === 0) {
    type = true;
    userExist = await UserAdmin.find({ email });
  }
  if (userExist.length > 0) {
    var result;
    if (userExist[0].emailVerify !== '') {
      var emailVerify = random(6, { letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' });
      if (type === false) {
        result = await UserStudent.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { emailVerify } })
      } else {
        result = await UserAdmin.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { emailVerify } })
      }
      if (result) {
        sendEmailCode(email, emailVerify, "code");
        res.status('200').json({ 'message': "El nuevo código fue enviado" })
      } else {
        res.status('403').json({ 'message': "Error" })
      }
    } else {
      res.status('403').json({ 'message': "Email ya confirmado" })
    }
  } else {
    res.status('403').json({ 'message': "Usuario no existe" })
  }
});

// está parte es para la recuperación de contraseña
// se envía un correo con un código de recuperación
// se recibe el código de recuperación y se compara con el código enviado
// si es correcto se elimina el código de recuperación y se cambia la contraseña
// si es incorrecto se envía un mensaje de error
// si el usuario no existe se envía un mensaje de error
router.post('/recovery', async function (req, res, next) {
  const { email, codeRecovery, newPassword } = req.body;
  var userExist = await UserStudent.find({ email });
  if (userExist.length === 0) {
    type = true;
    userExist = await UserAdmin.find({ email });
  }
  if (userExist.length > 0) {
    var result;
    if (userExist[0].recovery === codeRecovery) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(newPassword, salt);
      if (type === false) {
        result = await UserStudent.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { recovery: 'None', password: hash } })
      } else {
        result = await UserAdmin.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { recovery: 'None', password: hash } })
      }
      if (result) {
        res.status('200').json({ 'message': "Contraseña restaurada" })
      } else {
        res.status('403').json({ 'message': "Error" })
      }
    } else {
      res.status('403').json({ 'message': "Código incorrecto" })
    }
  } else {
    res.status('403').json({ 'message': "Usuario no existe" })
  }
});

// está parte es para el reenvío de correo electrónico
// se envía un correo con un nuevo código de recuperación
// si el usuario no existe se envía un mensaje de error
router.post('/recovery/send', async function (req, res, next) {
  var type = false;
  const { email } = req.body;
  var userExist = await UserStudent.find({ email });
  if (userExist.length === 0) {
    type = true;
    userExist = await UserAdmin.find({ email });
  }
  if (userExist.length > 0) {
    var result;
    var recovery = random(10, { letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' });
    if (type === false) {
      result = await UserStudent.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { recovery } })
    } else {
      result = await UserAdmin.findOneAndUpdate({ _id: userExist[0]._id }, { $set: { recovery } })
    }
    if (result) {
      sendEmailCode(email, recovery, "code");
      res.status('200').json({ 'message': "El nuevo código fue enviado" })
    } else {
      res.status('403').json({ 'message': "Error" })
    }
  } else {
    res.status('403').json({ 'message': "Usuario no existe" })
  }
});

module.exports = router;
