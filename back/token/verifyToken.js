const jwt = require('jsonwebtoken');
const key = require('../token/key');

function verifyToken(req,res,next){
    const token = req.headers['auth'];
    if(!token){
        return res.status(401).json({
            auth: false,
            message: 'Proceso no permitido'
        })
    }
    const decoded = jwt.verify(token, key.secret);
    req.userId = decoded.id;
    next();
}

module.exports = verifyToken;