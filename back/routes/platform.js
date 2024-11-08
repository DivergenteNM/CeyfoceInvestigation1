var express = require('express');
var router = express.Router();
const User = require('../models/userAdmin');
const UserStudent = require('../models/userStudent');
const Institutions = require('../models/institutions');
const scaleAll = require('../models/scaleAll');
const scaleUnique = require('../models/scaleUnique');
const typesOfQualification = require('../models/typesOfQualification');
const verifyToken = require('../token/verifyToken');
const updateAllResults = require('./updateAllResults');
const random = require('string-random');
const sendEmailCode = require('./sendEmail');

/* GET home page. */
//Docuemntación de la API
// este metodo es para crear una escala
// se debe enviar el código de la escala, el título, la descripción, el editor, el formulario de respuesta, los factores, las preguntas, los baremos, el cualitativo
// si el código de la escala es 1, se creará una nueva escala, si el código de la escala es diferente de 1, se editará la escala
// si el usuario es un superadministrador, se podrá crear o editar la escala
// si el usuario no es un superadministrador, no podrá crear o editar la escala
// se debe enviar el token de autenticación
// si la creación o edición es exitosa, se enviará un mensaje de éxito
// si el usuario no está autorizado, se enviará un mensaje de error
// si la base de datos está desconectada, se enviará un mensaje de error
router.post('/createScale/:code', verifyToken, async function (req, res, next) {
  var codeScale = req.params.code;
  const editor = req.userId;
  const { title, description, answerForm, factors, questions, baremosMnIg25, baremosMyIg75, baremosNegativo, cualitativoNegativo, cualitativoIntermedio, cualitativoPositivo } = req.body; // Añadir baremosNegativo

  const userExist = await User.findById(editor, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));

  if (userExist.role === 'SpAdmin') {
    if (codeScale === '1') {
      codeScale = random(5, { letters: 'ABCDEFG' });
      const newScaleAll = new scaleAll({ codeScale, title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75, baremosNegativo, cualitativoNegativo, cualitativoIntermedio, cualitativoPositivo }); // Incluir baremosNegativo
      const newScaleUnique = new scaleUnique({ codeScale, title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75, baremosNegativo, cualitativoNegativo, cualitativoIntermedio, cualitativoPositivo }); // Incluir baremosNegativo
      await newScaleAll.save();
      await newScaleUnique.save();
      res.status('200').json({ 'info': '¡¡¡ Creación exitosa !!!' })
    } else {
      //Es edición
      const newScaleAll = new scaleAll({ codeScale, title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75, baremosNegativo, cualitativoNegativo, cualitativoIntermedio, cualitativoPositivo }); // Incluir baremosNegativo
      const newScaleUnique = await scaleUnique.findOneAndUpdate({ codeScale }, { $set: { title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75, baremosNegativo, cualitativoNegativo, cualitativoIntermedio, cualitativoPositivo } }); // Incluir baremosNegativo
      await newScaleAll.save();
      await newScaleUnique.save();
      res.status('200').json({ 'info': '¡¡¡ Editado !!!' })
      await updateAllResults(codeScale, newScaleAll);
    }
  } else {
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});

//
// Ruta POST para crear nuevos tipos de calificación
router.post('/createTypesOfQualification', verifyToken, async function (req, res) {
  // Extrae los datos del cuerpo de la solicitud
  const { value, text, options } = req.body;
  // Busca al usuario administrador en la base de datos utilizando el userId del token verificado
  const userAdmin = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));
  // Verifica si el rol del usuario es 'SpAdmin' (Super Administrador)
  if (userAdmin.role === 'SpAdmin') {
    // Cuenta el número actual de tipos de calificación
    var lengthTypes = await typesOfQualification.count();
    // Crea un nuevo objeto typesOfQualification con los datos proporcionados y un código de tipo basado en el número actual de tipos
    const newTypeOfQualification = new typesOfQualification({
      codeType: lengthTypes,
      value,
      text,
      options
    });
    // Guarda el nuevo tipo de calificación en la base de datos
    await newTypeOfQualification.save();
    // Envía una respuesta de éxito
    res.status('200').json({ 'state': 'Creado con éxito' });
  } else {
    // Envía una respuesta de error si el usuario no está autorizado
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});


// Ruta GET para obtener las escalas
router.get('/scales', verifyToken, async function(req, res) {
  // Petición a la base de datos con las escalas en caché
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));
  // Verifica si el rol del usuario es 'SpAdmin' (Super Administrador) o 'Admin' (Administrador)
  if (userExist.role === 'SpAdmin' || userExist.role === 'Admin') {
    // Obtiene todas las escalas, seleccionando solo 'codeScale' y 'title', excluyendo '_id'
    const scales = await scaleUnique.find({}, { '_id': 0, 'codeScale': 1, 'title': 1 });
    // Envía una respuesta de éxito con las escalas obtenidas
    res.status('200').json({ 'scales': scales });
  } else {
    // Envía una respuesta de error si el usuario no está autorizado
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});

// Ruta GET para obtener las escalas
// Se obtiene la información de una escala en específico
router.get('/scale/:code', verifyToken, async function (req, res) {
  const codeScale = req.params.code;
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));
  if (userExist.role === 'SpAdmin') {
    const scale = await scaleUnique.findOne({ codeScale });
    console.log(scale)
    res.status('200').json({ 'scale': scale })
  } else {
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});

// Ruta GET para obtener la autorización de usuarios
router.get('/admin/toAuthorize/:id', verifyToken, async function (req, res) {
  const typeReq = req.params.id;
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));
  if (userExist.role === 'SpAdmin') {
    // const users = await User.find({role:"None"},{_id:0,fechaRegistro:0});
    const roles = [];
    if (typeReq === "1") {
      roles.push(
        {
          "$or": [
            {
              'role': "SpAdmin"
            },
            {
              'role': "Admin"
            },
            {
              'role': "Ally"
            },
          ]
        }
      )
    } else {
      roles.push(
        {
          role: "None"
        }
      )
    }
    const users = await User.aggregate(
      [
        {
          $lookup: {
            from: "institutions",
            localField: "institution",
            foreignField: "code",
            as: "institution"
          }
        },
        {
          $project: {
            name: "$name",
            role: "$role",
            institution: "$institution.name"
          }
        },
        {
          $match: {
            $and: roles
          }
        }
      ]
    )
    res.status('200').json({ users })
  } else {
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});


// Ruta GET para obtener la autorización de usuarios
// Se obtiene la información de los usuarios estudiantes para autorizar
router.get('/ally/toAuthorize/:id', verifyToken, async function (req, res) {
  const typeReq = req.params.id;
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));
  if (userExist.role === 'Ally') {
    const institutionFind = await Institutions.find({ code: userExist.institution }, { _id: 0, name: 1 });
    const roles = [];

    if (typeReq === "1") {
      roles.push(
        {
          institution: institutionFind[0].name
        },
        {
          role: "student"
        }
      )
    } else {
      roles.push(
        {
          institution: institutionFind[0].name
        },
        {
          role: "None"
        }
      )
      console.log("entro")
      console.log(roles)
    }
    const users = await UserStudent.aggregate(
      [
        {
          $lookup: {
            from: "institutions",
            localField: "institution",
            foreignField: "code",
            as: "institution"
          }
        },
        {
          $project: {
            name: "$name",
            role: "$role",
            institution: "$institution.name",
            course: "$course",
            age: "$age",
            sex: "$sex",
            file: "$file"
          }
        },
        {
          $match: {
            $and: roles
          }
        }
      ]
    )
    res.status('200').json({ users })
  } else {
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});


// Ruta GET para obtener la información de los usuarios
// Se obtiene la información de los usuarios estudiantes
router.get('/namesStudents', verifyToken, async function (req, res) {
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));
  if (userExist.role === 'SpAdmin' || userExist.role === 'Admin') {
    const users = await UserStudent.find({}, { _id: 0, name: 1 });
    res.status('200').json({ users })
  } else {
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});



// Ruta POST para obtener datos detallados de un estudiante
router.post('/dataStudent', verifyToken, async function(req, res) {
  // Extrae el nombre del estudiante del cuerpo de la solicitud
  const { nameStudent } = req.body;

  // Busca al usuario en la base de datos utilizando el userId del token verificado
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));

  // Verifica si el rol del usuario es 'SpAdmin' (Super Administrador) o 'Admin' (Administrador)
  if (userExist.role === 'SpAdmin' || userExist.role === 'Admin') {
    // Realiza una agregación en la colección UserStudent
    const user = await UserStudent.aggregate([
      {
        $lookup: {
          from: "institutions",
          localField: "institution",
          foreignField: "code",
          as: "institution"
        }
      },
      {
        $lookup: {
          from: "results",
          localField: "_id",
          foreignField: "idStudent",
          as: "results"
        }
      },
      {
        $lookup: {
          from: "scales",
          localField: "results.codeScale",
          foreignField: "codeScale",
          as: "scale"
        }
      },
      {
        $lookup: {
          from: "typesqualifications",
          localField: "scale.answerForm",
          foreignField: "codeType",
          as: "typesQ"
        }
      },
      {
        $project: {
          _id: 0,
          name: "$name",
          age: "$age",
          course: "$course",
          sex: "$sex",
          institution: "$institution.name",
          type: "$institution.type",
          residenceSector: "$residenceSector",
          resultsCodeScale: "$results.codeScale",
          resultsOverallResult: "$results.overallResult",
          resultsPhases: "$results.phases",
          resultsScale: "$results.resultsScale",
          resultsTitleScale: "$scale.title",
          factors: "$scale.factors",
          questions: "$scale.questions",
          answerForm: "$scale.answerForm",
          baremosMnIg25: "$scale.baremosMnIg25",
          baremosMyIg75: "$scale.baremosMyIg75",
          baremosNegativo: "$scale.baremosNegativo",
          cualitativoNegativo: "$scale.cualitativoNegativo",
          cualitativoIntermedio: "$scale.cualitativoIntermedio",
          cualitativoPositivo: "$scale.cualitativoPositivo",
          codeScale: "$scale.codeScale",
          title: "$scale.title",
          codeType: "$typesQ.codeType",
          value: "$typesQ.value"
        }
      },
      {
        $match: {
          name: nameStudent
        }
      }
    ]);

    // Envía una respuesta de éxito con los datos del estudiante obtenidos
    res.status('200').json(user[0]);
  } else {
    // Envía una respuesta de error si el usuario no está autorizado
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});

// Ruta POST para actualizar el rol de los usuarios
router.post('/updateRole', verifyToken, async function (req, res) {
  // Extrae los usuarios del cuerpo de la solicitud
  const users = req.body;

  // Busca al usuario en la base de datos utilizando el userId del token verificado
  const userExist = await User.findById(req.userId, { password: 0 }).catch(err => res.status(500).send("Base de datos desconectada"));

  // Verifica si el rol del usuario es 'SpAdmin' (Super Administrador)
  if (userExist.role === 'SpAdmin') {
    // Itera sobre cada usuario y actualiza su institución y rol
    for (let i = 0; i < users.length; i++) {
      await User.findOneAndUpdate({ _id: users[i].id }, { $set: { institution: users[i].institution, role: users[i].role } });
    }
    // Envía una respuesta de éxito
    res.status('200').json({ 'info': "Actualizado" });

  // Verifica si el rol del usuario es 'Ally' (Aliado)
  } else if (userExist.role === 'Ally') {
    // Itera sobre cada usuario estudiante y actualiza su rol
    for (let i = 0; i < users.length; i++) {
      await UserStudent.findOneAndUpdate({ _id: users[i].id }, { $set: { role: users[i].role } });
    }
    // Envía una respuesta de éxito
    res.status('200').json({ 'info': "Actualizado" });

  // Si el usuario no está autorizado
  } else {
    // Envía una respuesta de error
    res.status('401').json({ 'info': 'Usuario no autorizado' });
  }
});

// Ruta POST para enviar un mensaje interno
router.post('/internalMessage', async function (req, res) {
  // Extrae la información del cuerpo de la solicitud
  const info = req.body;
  // Lista de correos electrónicos a los que se enviará el mensaje
  const emails = ["hugoandres272@gmail.com"];
  // Itera sobre cada correo electrónico y envía el mensaje utilizando la función sendEmailCode
  emails.forEach(email => {
    sendEmailCode(email, info, "message");
  });
  // Envía una respuesta de éxito
  res.status('200').json({ 'info': "Mensaje enviado" });
});

module.exports = router;