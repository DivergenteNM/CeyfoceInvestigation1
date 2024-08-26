var express = require('express');
var router = express.Router();
const verifyToken = require('../token/verifyToken');
const UserAdmin = require('../models/userAdmin');
const UserStudent = require('../models/userStudent');
const scaleUnique = require('../models/scaleUnique');
const Institutions = require('../models/institutions');
var bcrypt = require('bcryptjs');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/filter', verifyToken, async function(req,res) {
  const admin = req.userId;
  const userAdmin = await UserAdmin.findById(admin, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userAdmin){
    if(userAdmin.role==='SpAdmin' || userAdmin.role==='Admin' || userAdmin.role==='Ally'){
      var agesBase = [];
      var institutions = [];
      var scales = [];
      var ages = [];
      if(userAdmin.role==='Ally'){
        var scalesAux = await scaleUnique.find({},{codeScale:1,title:1,_id:0});
        const agesArray = await UserStudent.aggregate(
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
                from: "scales",
                localField: "results.codeScale",
                foreignField: "codeScale",
                as: "scale"
              }
            },
            {
              $project: {
                _id: 0,
                age: "$age",
                code: "$institution.code",
                permissions: "$institution.permissions"
              }
            },
            {
              $match: {
                $or: [
                  {
                    code: userAdmin.institution
                  }
                ]
              }
              
            }
          ]
        )
        for (let j = 0; j < scalesAux.length; j++) {
          for (let k = 0; k < agesArray[0].permissions[0].length; k++) {
            if(scalesAux[j].codeScale===agesArray[0].permissions[0][k]) {
              scales.push({
                title: scalesAux[j].title
              });
            }
          }
        }
        for (let i = 0; i < agesArray.length; i++) {
          ages.push(agesArray[i].age);
        }
      }else{
        institutions = await Institutions.find({},{fechaRegistro:0,_id:0,editor:0});
        agesBase = await UserStudent.find({},{_id:0,age:1});
        scales = await scaleUnique.find({},{title:1,_id:0});
        for (let i = 0; i < agesBase.length; i++) {
          ages.push(agesBase[i].age);
        }
      }
      const dataArr = new Set(ages);
      var result = [...dataArr];
      function comparar(a, b) {
       return a - b;
      }
      ages = result.sort(comparar);
      res.status(200).json({"institutions":institutions,"ages":ages,"scales":scales});
    }else {
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  }else {
    res.status('100').json({'info':'Usuario no encontrado'});
  }
});

router.get('/getDataUser', verifyToken, async function(req,res) {
  const userId = req.userId;
  var data;
  data = await UserAdmin.findById(userId, {password:0,emailVerify:0,fechaRegistro:0,recovery:0,_id:0,__v:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(!data){
    data = await UserStudent.findById(userId, {password:0,emailVerify:0,fechaRegistro:0,recovery:0,file:0,_id:0,__v:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  }
  if(data){
    const institution = await Institutions.findOne({code:data.institution},{name:1,_id:0});
    data.institution = institution.name;
    res.status(200).json({data});
  }else{
    res.status('401').json({'info':'Usuario no encontrado'});
  }
})

router.post('/updatePass', verifyToken, async function(req,res) {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;
  var data;
  var type = false;
  data = await UserStudent.findById(userId).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(!data){
    type = true;
    data = await UserAdmin.findById(userId).catch(err=>res.status(500).send("Base de datos desconectada"));
  }
  if(data){
    const passwordVerify = await bcrypt.compare(oldPassword, data.password);
    if(passwordVerify){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(newPassword, salt);
      if(type===false){
        await UserStudent.findOneAndUpdate({_id:data._id},{$set: {password:hash}}) 
      }else{
        await UserAdmin.findOneAndUpdate({_id:data._id},{$set: {password:hash}}) 
      }
      res.status(200).json({'info':'Contraseña cambiada correctamente'});
    }else{
      res.status('401').json({'info':'Contraseña actual incorrecta'});
    }
  }else{
    res.status('401').json({'info':'Usuario no encontrado'});
  }
})

module.exports = router;
