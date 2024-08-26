const mongoose = require('mongoose');
const { Schema } = mongoose;

const userAdmin = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    institution: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date(Date.now())},
    role: { type: String, default: "None" },
    emailVerify: { type: String },
    recovery: { type: String, default: "None"}
});

module.exports = mongoose.model('UserAdmin', userAdmin);