
var SECRET_KEY = require('../config/config').SECRET_KEY_JWT;
var jwt = require('jsonwebtoken');


exports.verificaToken = function(req,res,next) {
  var token = req.query.token;
  jwt.verify(token, SECRET_KEY, (err, decoded)=> {
    if(err){
      return res.status(401).json({
        ok: false,
        message: 'token invalido',
        error: err
      });
    }
    req.user= decoded.user;
    next();


  });
}
