var express = require('express');
var router = express.Router();

/* GET home page. */
// Ruta inicial
router.get('/', function(req, res, next) {
  res.json({"App":"Funcionando"});
});

module.exports = router;
