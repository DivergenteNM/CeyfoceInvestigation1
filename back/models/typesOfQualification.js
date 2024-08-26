const mongoose = require('mongoose');
const { Schema } = mongoose;

const typesOfQualification = new Schema({
    codeType: { type: String, required: true },
    value: { type: String, required: true },
    text: { type: String, required: true },
    options: { type:Array, required: true },
    fechaRegistro: { type: Date, default: Date(Date.now())}
});

module.exports = mongoose.model('TypesQualification', typesOfQualification);