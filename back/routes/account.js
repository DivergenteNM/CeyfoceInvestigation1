var express = require('express');
var router = express.Router();
const UserAdmin = require('../models/userAdmin');
const UserStudent = require('../models/userStudent');
const key = require('../token/key');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const random = require('string-random');
const sendEmailCode = require('./sendEmail');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const firebase = require('./firebase');
const { uuid } = require('uuidv4');

/* GET home page. */
router.post('/login', async function(req, res, next) {
  const {email, password} = req.body;
  var passwordVerify = false;
  var user = await UserAdmin.findOne({email: email}).catch(err=>res.status(500).send("Base de datos desconectada"));
  if(user===null){
    user = await UserStudent.findOne({email: email}).catch(err=>res.status(500).send("Base de datos desconectada"));
  }
  if(user!==null){
    passwordVerify = await bcrypt.compare(password, user.password);
    if (passwordVerify) {
        if(user.emailVerify===''){
        const token = jwt.sign({id: user._id}, key.secret,{
          expiresIn: '4h'
        });
        var admissibleness = '';
        if(user.role==="SpAdmin"){
          admissibleness = "6465asd7#asd-1";
        }else if(user.role==="Admin"){
          admissibleness = "8435dpe1+nrs-3";
        }else if(user.role==="Ally"){
          admissibleness = "1201fpj4/tmq-1";
        }else if(user.role==="student"){
          admissibleness = "sl34mdms#fgd-6";
        }
        if(admissibleness===''){
          res.status('200').json({'name':user.name})
        }else{
          res.status('200').json({'auth':token,'admissibleness':admissibleness,'name':user.name})
        }
      }else{
        res.status('403').json({'message':'Email no verificado','email':user.email});
      }
    }else{
      res.status('403').json({'message':'Contraseña incorrecta'});
    }
  }else{
    res.status('403').json({'message':'Usuario no registrado'});
  }
});

router.post('/uploadImage', upload.single('file'), async function(req, res) {
  const blob = firebase.bucket.file(Date.now()+'-'+req.file.originalname)
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
    res.status(200).send({"file":url})
  })
  blobWriter.end(req.file.buffer)
  // res.status('200').json(req.file);
});

router.post('/register/student', async function(req, res, next){
  const {name,age,sex,course,residenceSector,institution,email,password,file} = req.body;
  const userExist = await UserStudent.find({email});
  if(userExist.length===0){
     var salt = bcrypt.genSaltSync(10);
     var hash = bcrypt.hashSync(password, salt);
     var emailVerify = random(6, {letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'});
     sendEmailCode(email,emailVerify,"code");
     const newStudent = new UserStudent({name,age,sex,course,residenceSector,institution,email,password:hash,emailVerify,file});
    //var salt = bcrypt.genSaltSync(10);
    //var hash = bcrypt.hashSync('temp1', salt);
    //const newStudent = new UserStudent({name,age,sex,course,residenceSector,institution,email,password,role:'student',emailVerify:'',file});
    const user = await newStudent.save();
    const token = jwt.sign({id: user._id}, key.secret,{
      expiresIn: '4h'
    });
    var admissibleness = "sl34mdms#fgd-6";
    res.status('200').json({'auth':token,'admissibleness':admissibleness,'name':user.name})
    // res.status('200').json({'info':"Usuario creado"});
  }else{
    res.status('200').json({'info':"Usuario ya existe"});
  }
});

router.post('/register/other', async function(req, res, next){
  const {name,email,password,institution} = req.body;
  const userExist = await UserAdmin.find({email});
  if(userExist.length===0){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var emailVerify = random(6, {letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'});
    sendEmailCode(email,emailVerify,"code");
    const newAdmin = new UserAdmin({name,email,password:hash,institution,emailVerify});
    await newAdmin.save();
    res.status('200').json({'info':"Usuario creado"})
  }else{
    res.status('200').json({'info':"Usuario ya existe"})
  }
});

router.post('/confirmation', async function(req, res, next){
  const {email,codeConfirmation} = req.body;
  var type = false;
  var userExist = await UserStudent.find({email});
  if(userExist.length===0) {
    type = true;
    userExist = await UserAdmin.find({email});
  }
  if(userExist.length>0){
    var result;
    if(userExist[0].emailVerify===codeConfirmation){
      if(type===false){
        result = await UserStudent.findOneAndUpdate({_id:userExist[0]._id},{$set: {emailVerify:''}}) 
      }else{
        result = await UserAdmin.findOneAndUpdate({_id:userExist[0]._id},{$set: {emailVerify:''}}) 
      }
      if(result){
        res.status('200').json({'message':"Email confirmado"})
      }else{
        res.status('403').json({'message':"Error"})
      }
    }else{
      res.status('403').json({'message':"Código incorrecto"})
    }
  }else{
    res.status('403').json({'message':"Usuario no existe"})
  }
});

router.post('/resend', async function(req, res, next){
  const {email} = req.body;
  var userExist = await UserStudent.find({email});
  if(userExist.length===0) {
    type = true;
    userExist = await UserAdmin.find({email});
  }
  if(userExist.length>0){
    var result;
    if(userExist[0].emailVerify!==''){
      var emailVerify = random(6, {letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'});
      if(type===false){
        result = await UserStudent.findOneAndUpdate({_id:userExist[0]._id},{$set: {emailVerify}}) 
      }else{
        result = await UserAdmin.findOneAndUpdate({_id:userExist[0]._id},{$set: {emailVerify}}) 
      }
      if(result){
        sendEmailCode(email,emailVerify,"code");
        res.status('200').json({'message':"El nuevo código fue enviado"})
      }else{
        res.status('403').json({'message':"Error"})
      }
    }else{
      res.status('403').json({'message':"Email ya confirmado"})
    }
  }else{
    res.status('403').json({'message':"Usuario no existe"})
  }
});

router.post('/recovery', async function(req, res, next){
  const {email,codeRecovery,newPassword} = req.body;
  var userExist = await UserStudent.find({email});
  if(userExist.length===0) {
    type = true;
    userExist = await UserAdmin.find({email});
  }
  if(userExist.length>0){
    var result;
    if(userExist[0].recovery===codeRecovery){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(newPassword, salt);
      if(type===false){
        result = await UserStudent.findOneAndUpdate({_id:userExist[0]._id},{$set: {recovery:'None',password:hash}}) 
      }else{
        result = await UserAdmin.findOneAndUpdate({_id:userExist[0]._id},{$set: {recovery:'None',password:hash}}) 
      }
      if(result){
        res.status('200').json({'message':"Contraseña restaurada"})
      }else{
        res.status('403').json({'message':"Error"})
      }
    }else{
      res.status('403').json({'message':"Código incorrecto"})
    }
  }else{
    res.status('403').json({'message':"Usuario no existe"})
  }
});

router.post('/recovery/send', async function(req, res, next){
  var type = false;
  const {email} = req.body;
  var userExist = await UserStudent.find({email});
  if(userExist.length === 0) {
    type = true;
    userExist = await UserAdmin.find({email});
  }
  if(userExist.length > 0){
    var result;
    var recovery = random(10, {letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'});
    if(type===false){
      result = await UserStudent.findOneAndUpdate({_id:userExist[0]._id},{$set: {recovery}}) 
    }else{
      result = await UserAdmin.findOneAndUpdate({_id:userExist[0]._id},{$set: {recovery}}) 
    }
    if(result){
      sendEmailCode(email,recovery,"code");
      res.status('200').json({'message':"El nuevo código fue enviado"})
    }else{
      res.status('403').json({'message':"Error"})
    }
  }else{
    res.status('403').json({'message':"Usuario no existe"})
  }
});

module.exports = router;
