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
router.post('/createScale/:code', verifyToken, async function(req, res, next) {
  var codeScale = req.params.code;
  const editor = req.userId;
  const {title, description, answerForm, factors, questions, baremosMnIg25, baremosMyIg75} = req.body;
  const userExist = await User.findById(editor, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  // console.log(code,title,description,answerForm, questions);
  if(userExist.role==='SpAdmin'){
    if(codeScale==='1'){
      codeScale = random(5, {letters: 'ABCDEFG'});
      const newScaleAll = new scaleAll({codeScale, title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75});
      const newScaleUnique = new scaleUnique({codeScale, title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75});
      await newScaleAll.save();
      await newScaleUnique.save();
      res.status('200').json({'info':'¡¡¡ Creación exitosa !!!'})
    }else{
      //Es edición
      const newScaleAll = new scaleAll({codeScale, title, description, editor, answerForm, factors ,questions, baremosMnIg25, baremosMyIg75});
      const newScaleUnique = await scaleUnique.findOneAndUpdate({codeScale},{$set: {title, description, editor, answerForm, factors, questions, baremosMnIg25, baremosMyIg75}});
      await newScaleAll.save();
      await newScaleUnique.save();
      res.status('200').json({'info':'¡¡¡ Editado !!!'})
      await updateAllResults(codeScale,newScaleAll);
    }
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.post('/createTypesOfQualification',verifyToken, async function(req,res){
  const {value,text,options} = req.body;
  const userAdmin = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userAdmin.role==='SpAdmin'){
    var lengthTypes = await typesOfQualification.count();
    const newTypeOfQualification = new typesOfQualification({
      codeType: lengthTypes,
      value,
      text,
      options
    });
    await newTypeOfQualification.save();
    res.status('200').json({'state':'Creado con éxito'})
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.get('/scales', verifyToken, async function(req, res) {
  //Petición a la base de datos con las escalas en caché
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist.role==='SpAdmin' || userExist.role==='Admin'){
    const scales = await scaleUnique.find({},{'_id':0,'codeScale':1,'title':1});
    res.status('200').json({'scales':scales})
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.get('/scale/:code', verifyToken, async function(req, res) {
  const codeScale = req.params.code;
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist.role==='SpAdmin'){
    const scale = await scaleUnique.findOne({codeScale});
    console.log(scale)
    res.status('200').json({'scale':scale})
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.get('/admin/toAuthorize/:id', verifyToken, async function(req, res) {
  const typeReq = req.params.id;
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist.role==='SpAdmin'){
    // const users = await User.find({role:"None"},{_id:0,fechaRegistro:0});
    const roles = [];
    if(typeReq==="1"){
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
    }else{
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
    res.status('200').json({users})
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.get('/ally/toAuthorize/:id', verifyToken, async function(req, res) {
  const typeReq = req.params.id;
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist.role==='Ally'){
    const institutionFind = await Institutions.find({code:userExist.institution},{_id:0,name:1});
    const roles = [];
    
    if(typeReq==="1"){
      roles.push(
        {
          institution: institutionFind[0].name
        },
        {
          role: "student"
        }
      )
    }else{
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
    res.status('200').json({users})
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.get('/namesStudents', verifyToken, async function(req, res) {
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist.role==='SpAdmin' || userExist.role==='Admin'){
    const users = await UserStudent.find({},{_id:0,name:1});
    res.status('200').json({users})
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.post('/dataStudent', verifyToken, async function(req, res) {
  const {nameStudent} = req.body;
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist.role==='SpAdmin' || userExist.role==='Admin'){
    const user = await UserStudent.aggregate(
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
              factors : "$scale.factors",
              questions: "$scale.questions",
              answerForm: "$scale.answerForm",
              baremosMnIg25: "$scale.baremosMnIg25",
              baremosMyIg75: "$scale.baremosMyIg75",
              codeScale: "$scale.codeScale",
              title: "$scale.title",
              codeType: "$typesQ.codeType",
              value: "$typesQ.value"
          }
        },
        {
          $match: {
            name:nameStudent
          }
        }
      ]
    )
    res.status('200').json(user[0])
  }else {
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.post('/updateRole', verifyToken, async function(req, res) {
  const users = req.body;
  const userExist = await User.findById(req.userId, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  console.log(users);
  if(userExist.role==='SpAdmin'){
    for (let i = 0; i < users.length; i++) {
      await User.findOneAndUpdate({_id:users[i].id},{$set: {institution:users[i].institution,role:users[i].role}})
    }
    res.status('200').json({'info':"Actualizado"});
  }else if(userExist.role==='Ally'){
    for (let i = 0; i < users.length; i++) {
      await UserStudent.findOneAndUpdate({_id:users[i].id},{$set: {role:users[i].role}})
    }
    res.status('200').json({'info':"Actualizado"});
  }else{
    res.status('401').json({'info':'Usuario no autorizado'});
  }
});

router.post('/internalMessage', async function(req, res) {
  const info = req.body;
  const emails = ["hugoandres272@gmail.com"];
  emails.forEach(email=>{
    sendEmailCode(email,info,"message");
  })
  res.status('200').json({'info':"Mensaje enviado"});
});

module.exports = router;