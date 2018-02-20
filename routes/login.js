var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SECRET_KEY = require('../config/config').SECRET_KEY_JWT;

var app = express();

var User = require('../models/user');


app.post('/', (req,res,next) =>{
  var body = req.body;

  User.findOne({email: body.email}, (err, user) => {

    if(err) {
      return res.status(500).json({
        ok: false,
        message: 'error al buscar usuario',
        errors: error
      })
    }
    if(!user){
      return res.status(400).json({
        ok: false,
        message: 'credenciales incorrectas -email',
        errors: err
      })
    }
    if(!bcrypt.compareSync(body.password, user.password)){
      return res.status(400).json({
        ok: false,
        message: 'credenciales incorrectas -password',
        errors: err
      })
    }

    //crear token
    user.password = '';
    var token = jwt.sign({user: user}, SECRET_KEY,{ expiresIn: 14400})

    res.status(200).json({
      ok: true,
      user,
      token
    });
  })

})

module.exports = app;
