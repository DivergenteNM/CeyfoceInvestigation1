const mongoose = require('mongoose');
const { Schema } = mongoose;

const scalesUniqueSchema = new Schema({
    codeScale: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    editor: { type: String, required: true },
    answerForm: { type: String, required: true },
    factors: { type: Array, required: true },
    questions: { type: Array, required: true },
    baremosMnIg25: { type: String },
    baremosMyIg75: { type: String },
    baremosNegativo: { type: Boolean, default: false },
    cualitativoNegativo: { type: String },
    cualitativoIntermedio: { type: String },
    cualitativoPositivo: { type: String },
    fechaRegistro: { type: Date, default: Date(Date.now())}
});

module.exports = mongoose.model('Scales', scalesUniqueSchema);