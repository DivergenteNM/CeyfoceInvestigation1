var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const UserStudent = require('../models/userStudent');
const UserAdmin = require('../models/userAdmin');
const scaleUnique = require('../models/scaleUnique');
const Institutions = require('../models/institutions');
const verifyToken = require('../token/verifyToken');
const Results = require('../models/results');
const processFilters = require('./filterText');
const TypeQualification = require('../models/typesOfQualification');

/* GET home page. */
router.post('/students', verifyToken, async function(req, res, next) {
  const student = req.userId;
  const {codeScale, resultsScale} = req.body;
  const userExist = await UserStudent.findById(student, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  const scale = await scaleUnique.findOne({codeScale});
  var valueQualification = await TypeQualification.findOne({codeType:scale.answerForm});
  valueQualification = valueQualification.value;

  if(userExist && scale){
    var overallResult = 0;
    var phases = [];
    var aux = 0;
    
    // Cálculo del resultado global
    for (let i = 0; i < scale.questions.length; i++) {
        aux = 0;
        if (scale.questions[i].typeOfQuestion === 'D') {
            aux = resultsScale[i].charCodeAt(0) - 97;
        } else {
            aux = parseInt(valueQualification) - (resultsScale[i].charCodeAt(0) - 97);
        }
        overallResult += aux;
    }

    // Cálculo de los promedios de las fases
    for (let i = 0; i < scale.factors.length; i++) {
        aux = 0;
        let count = 0;
        for (let j = 0; j < scale.questions.length; j++) {
            if(i === parseInt(scale.questions[j].factor)){
                count++;
                if (scale.questions[j].typeOfQuestion === 'D') {
                    aux += resultsScale[j].charCodeAt(0) - 97;
                } else {
                    aux += parseInt(valueQualification) - (resultsScale[j].charCodeAt(0) - 97);
                }
            }
        }
        if (count > 0) {
            phases.push(aux / count); // Asegurarse de no dividir por cero
        } else {
            phases.push(0); // O manejar de otra manera si no hay preguntas para el factor
        }
    }

    const resultStudent = new Results({
      idStudent: mongoose.Types.ObjectId(student),
      codeScale,
      resultsScale,
      overallResult,
      phases
    });
    await resultStudent.save();
    res.status('200').json({'info':'¡¡¡ Gracias por responder !!!'})
  } else {
    res.status('100').json({'info':'Usuario y/o escala no encontrados'});
  }
});

router.post('/filter', verifyToken, processFilters, async function(req, res, next) {
  const idUser = req.userId;
  const arrayPipeline = req.filter;
  var scale = [];

  const userAdmin = await UserAdmin.findById(idUser, {password:0}).catch(err => res.status(500).send("Base de datos desconectada"));
  const institutionName = await Institutions.find({code: userAdmin.institution},{_id: 0, name: 1});
  const scalesUniq = await scaleUnique.find({},{_id: 0, codeScale: 1, title: 1});
  for (let i = 0; i < req.body.length; i++) {
    if (req.body[i].name === "Escalas") {
      for (let j = 0; j < req.body[i].options.length; j++) {
        if (req.body[i].options[j].checked === true) {
          for (let k = 0; k < scalesUniq.length; k++) {
            if (req.body[i].options[j].name === scalesUniq[k].title) {
              scale.push({
                codeScale: scalesUniq[k].codeScale,
                title: scalesUniq[k].title
              });
            }
          }
        }
      }
      break;
    }
  }

  if (userAdmin) {
    if (userAdmin.role === 'SpAdmin' || userAdmin.role === 'Admin' || userAdmin.role === 'Ally') {
      if (userAdmin.role === 'Ally') {
        arrayPipeline.$and.push({
          institution: institutionName[0].name
        });
      }

      const studentResults = await UserStudent.aggregate(
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
            $lookup: {
              from: "results",
              localField: "_id",
              foreignField: "idStudent",
              as: "resultsAs"
            }
          },
          {
            $project: {
              name: "$name",
              role: "$role",
              institution: "$institution.name",
              type: "$institution.type",
              course: "$course",
              age: "$age",
              sex: "$sex",
              residenceSector: "$residenceSector",
              resultsScale: "$resultsAs.resultsScale",
              resultsPhases: "$resultsAs.phases",
              resultsCodeScale: "$resultsAs.codeScale",
              resultsOverallResult: "$resultsAs.overallResult"
            }
          },
          {
            $match: arrayPipeline
          },
          { $sort : { institution : 1 } }
        ]
      )
      .then(res => {
        var auxText = [];
        var residenceSector = []; 
        var resultsScale = [];
        var resultsPhases = [];
        var resultsCodeScale = [];
        var resultsOverallResult = [];
        var flagAuth = 0;
        for (let i = 0; i < res.length; i++) {
          auxText = [];
          residenceSector = [];
          resultsScale = [];
          resultsPhases = [];
          resultsCodeScale = [];
          resultsOverallResult = [];
          flagAuth = 0;
          for (let j = 0; j < res[i].resultsCodeScale.length; j++) {
            for (let k = 0; k < scale.length; k++) {
              if (res[i].resultsCodeScale[j] === scale[k].codeScale) {
                auxText.push(scale[k].title);
                resultsScale.push(res[i].resultsScale[j]);
                resultsPhases.push(res[i].resultsPhases[j]);
                resultsCodeScale.push(res[i].resultsCodeScale[j]);
                resultsOverallResult.push(res[i].resultsOverallResult[j]);
                flagAuth++;
              }
            }
          }

          if (auxText.length === 0 || flagAuth !== scale.length) {
            res.splice(i, 1);
            i--;
          } else {
            res[i] = {
              ...res[i],
              resultsScale,
              resultsPhases,
              resultsCodeScale,
              resultsOverallResult,
              resultsTitleScale: auxText
            };
          }
        }
        return res;
      });
      res.status(200).json({"studentResults": studentResults});
    } else {
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  } else {
    res.status('100').json({'info':'Usuario no encontrado'});
  }
});

router.get('/scales', verifyToken, processFilters, async function(req, res, next) {
  const idUser = req.userId;

  const userAdmin = await UserAdmin.findById(idUser, {password:0}).catch(err => res.status(500).send("Base de datos desconectada"));
  if (userAdmin) {
    if (userAdmin.role === 'SpAdmin' || userAdmin.role === 'Admin' || userAdmin.role === 'Ally') {
      const scales = await scaleUnique.find({},{codeScale: 1, title: 1, questions: 1, _id: 0, factors: 1, answerForm: 1, baremosMnIg25: 1, baremosMyIg75: 1});
      const typesOfQualification = await TypeQualification.find({},{codeType: 1, value: 1, _id: 0});
      res.status(200).json({"scaleResults": scales, "typesOfQualification": typesOfQualification});
    } else {
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  } else {
    res.status('100').json({'info':'Usuario no encontrado'});
  }
});

module.exports = router;
