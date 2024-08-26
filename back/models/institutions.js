const mongoose = require('mongoose');
const { Schema } = mongoose;

const institutions = new Schema({
    editor: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    courses: { type: Array, required: true },
    type: { type: String, required: true },
    permissions: { type: Array, required: true },
    fechaRegistro: { type: Date, default: Date(Date.now())}
});

module.exports = mongoose.model('Institutions', institutions);