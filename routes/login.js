var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SECRET_KEY = require('../config/config').SECRET_KEY_JWT;
var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
var GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;
var app = express();

var User = require('../models/user');


const { OAuth2Client } = require('google-auth-library');
//var auth = new GoogleAuth;

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
//autenticacion por google
app.post('/google', (req, res,next) =>{
  var token = req.body.token;

  const oAuth2Client = new OAuth2Client(
     GOOGLE_CLIENT_ID,
     GOOGLE_SECRET
   );

   oAuth2Client.verifyIdToken({idToken: token},
     (err,data) => {

     if(err){
       res.status(200)
       .json(createErrorObject('error en el token'));
     }
     var payload = data.payload;
     User.findOne({email: payload.email}, (err, user)=>{
       if(err){
         res.status(200)
         .json(createErrorObject('error al obtener usuario'));
       }
       if(user){
         if(!user.google){
           return res.status(400)
           .json(createErrorObject('tienes que iniciar con tu cuenta'))
         }
         res.status(200).json({
           ok: true,
           user: user,
           token: jwt.sign({user: user}, SECRET_KEY,{ expiresIn: 14400})
         })
       }else{
         var newUser = User();
         newUser.name = payload.name;
         newUser.email = payload.email;
         newUser.image = payload.picture;
         newUser.password = ':)';
         newUser.google = true;

         newUser.save((err,user) =>{
           if(err){
             res.status(500)
             .json(createErrorObject('error al crear usuario google'))
           }
           res.status(200).json({
             ok: true,
             user: user,
             token: jwt.sign({user: user}, SECRET_KEY,{ expiresIn: 14400})
           })
         })
       }
     })

   });

});
function createErrorObject(message){
  return {
    ok:false,
    message: message
  }
}
module.exports = app;
