const mongoose = require('mongoose');
const URI = 'mongodb+srv://ipsicologia98:0FaU30c22dSydVxU@cluster0.9dirpxu.mongodb.net/pruebaInvestigacion?retryWrites=true&w=majority';

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(db => console.log('Db is connected'))
  .catch(error => {console.log("Error de base de datos: ");console.error(error);});

module.exports = mongoose;