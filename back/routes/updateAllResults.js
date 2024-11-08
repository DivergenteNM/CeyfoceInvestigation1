const Results = require('../models/results');
const TypeQualification = require('../models/typesOfQualification');


// Función que actualiza los resultados de todos los usuarios que han realizado un test de una escala en concreto
// Recibe como parámetros el código de la escala y la escala en cuestión
// Actualiza el resultado global y las fases de cada usuario
// Devuelve un error si no se ha podido actualizar
// Devuelve un mensaje de éxito si se ha podido actualizar
async function updateAllResults(codeScale,scale){
    const allResultsScale = await Results.find({codeScale});
    var valueQualification = await TypeQualification.findOne({codeType:scale.answerForm});
    valueQualification = valueQualification.value;
    var aux;
    var overallResult;
    var phases;
    var count;
    for (let m = 0; m < allResultsScale.length; m++) {
        aux = 0;
        overallResult = 0;
        phases = [];
        for (let i = 0; i < scale.questions.length; i++) {
            aux = 0;
            if (scale.questions[i].typeOfQuestion==='D') {
                aux = allResultsScale[m].resultsScale[i].charCodeAt(0)-97;
            }else{
                aux = parseInt(valueQualification)-allResultsScale[m].resultsScale[i].charCodeAt(0)+97;
            }
            overallResult = overallResult + aux;
        }
        count = 0;
        for (let i = 0; i < scale.factors.length; i++) {
            aux = 0;
            count = 0;
            for (let j = 0; j < scale.questions.length; j++) {
                if(i===parseInt(scale.questions[j].factor)){
                    count++;
                    if (scale.questions[j].typeOfQuestion==='D') {
                        aux = aux + allResultsScale[m].resultsScale[j].charCodeAt(0)-97;
                    }else{
                        aux = aux + parseInt(valueQualification)-allResultsScale[m].resultsScale[j].charCodeAt(0)+97;
                    }
                }
            }
            phases.push((aux/count)*33);
        }
        await Results.findOneAndUpdate({_id:allResultsScale[m]._id},{$set: {overallResult, phases}});
    }
}

module.exports = updateAllResults;



