const mongoose = require('mongoose');
const { Schema } = mongoose;

const userStudent = new Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    sex: { type: String, required: true },
    course: { type: String, required: true },
    residenceSector: { type: String, required: true },
    institution: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date(Date.now())},
    file: { type: String },
    role: { type: String , default: "None" },
    emailVerify: { type: String },
    recovery: { type: String, default: "None"}
    //datos del permiso
});

module.exports = mongoose.model('UserStudent', userStudent);