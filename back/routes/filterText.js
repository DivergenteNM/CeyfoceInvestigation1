var express = require('express');
const scaleUnique = require('../models/scaleUnique');

async function processFilters(req,res,next){
//     return new Promise((resolve, reject)=>{
    var sex = [];
    var residenceSector = [];
    var institution = [];
    var age = [];
    var course = [];
    var scale = [];
    var range = [];
    var typeOfSchool = [];
    var andd = [];
    for (let i = 0; i < req.body.length; i++) {
        switch(req.body[i].name){
            case 'Sexo':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        // filtersRequired['sex'] = req.body[i].options[j].name};
                        sex.push({sex:req.body[i].options[j].name})
                    }
                }
                break;
            case 'Sector':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        residenceSector.push({residenceSector:req.body[i].options[j].name})
                    }
                }
                break;
            case 'Instituciones':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        institution.push({institution:req.body[i].options[j].name})
                    }
                }
                break;
            case 'Edad':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        age.push({age:req.body[i].options[j].name})
                    }
                }
                break;
            case 'Grados':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        course.push({course:{$regex:`${req.body[i].options[j].name}`}})
                    }
                }
                break;
            case 'Escalas':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        scale.push({resultsTitleScale:req.body[i].options[j].name})
                    }
                }
                break;
            case 'Rangos':
                break;
            case 'Tipo de colegio':
                for (let j = 0; j < req.body[i].options.length; j++) {
                    if(req.body[i].options[j].checked===true){
                        typeOfSchool.push({type:req.body[i].options[j].name})
                    }
                }
                break;
        }
    }
    andd.push({role:"student"})
    if(sex.length!==0){
        andd.push({
            "$or": sex,
        });
    }
    if(residenceSector.length!==0){
        andd.push({
            "$or": residenceSector,
        });
    }
    if(institution.length!==0){
        andd.push({
            "$or": institution,
        });
    }
    if(age.length!==0){
        andd.push({
            "$or": age,
        });
    }
    if(course.length!==0){
        andd.push({
            "$or": course,
        });
    }
    // if(scale.length!==0){
    //     andd.push({
    //         "$and": scale,
    //     });
    // }
    if(range.length!==0){
        andd.push({
            "$or": range,
        });
    }
    if(typeOfSchool.length!==0){
        andd.push({
            "$or": typeOfSchool
        });
    }
    const filtersRequired = {"$and": andd};
    req.filter = filtersRequired;
    next();
}

module.exports = processFilters;