var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const UserStudent = require('../models/userStudent');
const scaleUnique = require('../models/scaleUnique');
const Institutions = require('../models/institutions');
const Results = require('../models/results');
const verifyToken = require('../token/verifyToken');
const TypeQualification = require('../models/typesOfQualification');

/* GET home page. */
router.get('/scales', verifyToken, async function(req, res, next) {
  const idUser = req.userId;

  const userStudent = await UserStudent.findById(idUser, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userStudent){
    if(userStudent.role==='student'){
      if(userStudent.institution){
        const scaleAllowed = await Institutions.find({code:userStudent.institution},{permissions:1,_id:0});
        const scalesMade = await Results.find({idStudent:idUser},{_id:0,codeScale:1});
        var scalesAllowedCurrent = [];
        var flag = true;
        var response = [];
        if(scalesMade!==null){
          for (let j = 0; j < scaleAllowed[0].permissions.length; j++) {
            flag = true;
            for (let i = 0; i < scalesMade.length; i++) {
              if(scalesMade[i].codeScale===scaleAllowed[0].permissions[j]){
                flag = false;
                break;
              }          
            }
            if(flag){
              scalesAllowedCurrent.push(scaleAllowed[0].permissions[j]);
            }
          }
        }else{
          scalesAllowedCurrent = scaleAllowed;
        }
        for (let i = 0; i < scalesAllowedCurrent.length; i++) {
          var sc = await scaleUnique.find({codeScale:scalesAllowedCurrent[i]},{codeScale:1,title:1,_id:0});
          response.push(sc[0]);
        }
        res.status(200).json(response);
      }else{
        res.status('401').json({'info':'Usuario no autorizado'});
      }
    }else {
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  }else {
    res.status('100').json({'info':'Usuario no encontrado'});
  }
});

router.get('/scale/:idScale', verifyToken, async function(req, res, next) {
  const idUser = req.userId;
  const idScale = req.params.idScale;
  console.log(idScale)
  const userStudent = await UserStudent.findById(idUser, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userStudent){
    if(userStudent.role==='student'){
      if(userStudent.institution){
        const scaleAllowed = await Institutions.find({code:userStudent.institution},{permissions:1,_id:0});
        const scalesMade = await Results.find({idStudent:idUser},{_id:0,codeScale:1});
        var scalesAllowedCurrent = [];
        var flag = true;
        var result;
        if(scalesMade!==null){
          for (let j = 0; j < scaleAllowed[0].permissions.length; j++) {
            flag = true;
            for (let i = 0; i < scalesMade.length; i++) {
              if(scalesMade[i].codeScale===scaleAllowed[0].permissions[j]){
                flag = false;
                break;
              }          
            }
            if(flag){
              scalesAllowedCurrent.push(scaleAllowed[0].permissions[j]);
            }
          }
        }else{
          scalesAllowedCurrent = scaleAllowed;
        }
        for (let i = 0; i < scalesAllowedCurrent.length; i++) {
          console.log("hola: "+scalesAllowedCurrent[i]+"==="+idScale)
          if(scalesAllowedCurrent[i]===idScale){
            result = await scaleUnique.aggregate([
              {
                $lookup: {
                  from: "typesqualifications",
                  localField: "answerForm",
                  foreignField: "codeType",
                  as: "typesForm"
                }
              },
              { 
                $project: {
                  _id: 0,
                  codeScale: "$codeScale",
                  title: "$title",
                  description: "$description",
                  answerType: "$typesForm.value",
                  answerTypeText: "$typesForm.text",
                  questions: "$questions",
                  optionsType: "$typesForm.options"
                } 
              },
              {
                $match: {
                  $and: [
                    {
                      codeScale: idScale
                    }
                  ]
                }
              }
            ])
            break;
          }
        }
        res.status(200).json(result);
      }else{
        res.status('401').json({'info':'Usuario no autorizado'});
      }
    }else {
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  }else {
    res.status('100').json({'info':'Usuario no encontrado'});
  }
});



router.post('/students', verifyToken, async function(req, res, next) {
  const student = req.userId;
  //Code: código de la escala. resultsScale: resultados del estudiante
  const {codeScale, resultsScale} = req.body;
  const userExist = await UserStudent.findById(student, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  const scale = await scaleUnique.findOne({codeScale});
  var valueQualification = await TypeQualification.findOne({codeType:scale.answerForm});
  valueQualification = valueQualification.value;
  //Debe desaparecer valueQualification se debe reemplazar con typesOfQualification.js 
  // const valueQualification = {
  //     value: '3'
  // }
  console.log(valueQualification)
  if(userExist && scale){
    var overallResult = 0;
    var phases = [];
    // const valueQualification = await TypeQualification.findOne({'codeType':scale.answerForm});
    var aux = 0;
    for (let i = 0; i < scale.questions.length; i++) {
        aux = 0;
        if (scale.questions[i].typeOfQuestion==='D') {
            aux = resultsScale[i].charCodeAt(0)-97;
            console.log("direct")
            console.log(aux);
          }else{
            aux = parseInt(valueQualification)-resultsScale[i].charCodeAt(0)+97;
        }
        overallResult = overallResult + aux;
    }
    var count = 0;
    for (let i = 0; i < scale.factors.length; i++) {
        aux = 0;
        count = 0;
        for (let j = 0; j < scale.questions.length; j++) {
            if(i===parseInt(scale.questions[j].factor)){
                count++;
                if (scale.questions[j].typeOfQuestion==='D') {
                    aux = aux + resultsScale[j].charCodeAt(0)-97;
                  }else{
                    aux = aux + parseInt(valueQualification)-resultsScale[j].charCodeAt(0)+97;
                }
            }
        }
        phases.push(aux/count);
    }
    const resultStudent = new Results({idStudent:mongoose.Types.ObjectId(student),codeScale,resultsScale,overallResult,phases});
    await resultStudent.save();
    res.status('200').json({'info':'¡¡¡ Gracias por responder !!!'})
  }else {
    res.status('100').json({'info':'Usuario y/o escala no encontrados'});
  }
});

module.exports = router;