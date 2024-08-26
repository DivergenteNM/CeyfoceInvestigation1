const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const results = new Schema({
    idStudent: { type: ObjectId, required: true },
    codeScale: { type: String, required: true },
    resultsScale: { type: Array, required: true },
    overallResult: { type: String, required: true },
    phases: { type: Array, required: true },
    fechaRegistro: { type: Date, default: Date(Date.now())}
});

module.exports = mongoose.model('Results', results);