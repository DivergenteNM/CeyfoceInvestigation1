var express = require('express');
var router = express.Router();
const User = require('../models/userAdmin');
const Student = require('../models/userStudent');
const Institutions = require('../models/institutions');
const verifyToken = require('../token/verifyToken');
const random = require('string-random');

// esta ruta es para crear una nueva institucion
router.post('/add/:code', verifyToken, async function(req, res, next) {
  var code = req.params.code;
  console.log("Code");
  console.log(code);
  const admin = req.userId;
  const {name, courses, type, permissions} = req.body;
  const userExist = await User.findById(admin, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));

  if(userExist){
    if(userExist.role==='SpAdmin'){
        if(code==='1'){
            code = random(6, {letters: 'ABCDEFGHI'});
            const newInstitution = new Institutions({'editor':admin, code, name, courses, type, permissions});
            await newInstitution.save();
            res.status('200').json({'info':'¡¡¡ Institución creada !!!'})
        }else{
            const editInstitution = await Institutions.findOneAndUpdate({code},{$set: {'editor':admin, name, courses, type, permissions}});
            await editInstitution.save();
            res.status('200').json({'info':'¡¡¡ Cambios guardados !!!'})
        }
    }else{
        res.status('401').json({'info':'Usuario no autorizado'});
    }
  }else {
    res.status('100').json({'info':'Usuario no encontrado'});
  }
});

// esta ruta es para obtener todas las instituciones
router.get('/getAll', verifyToken, async (req,res) => {
  const admin = req.userId;
  const userExist = await User.findById(admin, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist){
    if(userExist.role==='SpAdmin'){
      const institutions = await Institutions.find({},{code:1,name:1,_id:0})
      res.status('200').json({institutions});
    }else{
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  }else{
    res.status('401').json({'info':'Usuario no encontrado'});
  }
});

// esta ruta es para obtener una institucion por su codigo
router.get('/unique/:code', verifyToken, async (req,res) => {
  const admin = req.userId;
  const codeInstitution = req.params.code;
  const userExist = await User.findById(admin, {password:0}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(userExist){
    if(userExist.role==='SpAdmin'){
      const institution = await Institutions.find({code:codeInstitution},{_id:0,editor:0,fechaRegistro:0,__v:0});
      res.status('200').json({institution});
    }else{
      res.status('401').json({'info':'Usuario no autorizado'});
    }
  }else{
    res.status('401').json({'info':'Usuario no encontrado'});
  }
});

// esta ruta es para obtener una institucion por su codigo
router.get('/userRegister', async (req,res) => {
  const institutions = await Institutions.find({},{_id:0,code:1,name:1,courses:1});
  res.status('200').json({institutions});
});

module.exports = router;