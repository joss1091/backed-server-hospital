var express = require('express');
var app = express();
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var verificaToken = require('../middlewares/autenticacion')

app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  User.find({},'name email image role')
    .skip(desde)
    .limit(5)
    .exec(
      (error, users) => {
      if(error) {
        return res.status(500).json({
          ok: false,
          message: 'error cargando usuario',
          errors: error
        })
      }

      User.count({},(err, conteo) => {
        res.status(200).json({
          ok: true,
          users: users,
          total: conteo
        });
      })

  })
})



//crear usuario
app.post('/', verificaToken.verificaToken,(req,res, NEXT) => {
  var body = req.body;
  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    image: body.image,
    role: body.role
  });
  user.save((err, newUser) => {
    if(err){
      return res.status(400).json({
        ok: false,
        message: 'error al crear usuario',
        error: err
      });
    }
    res.status(201).json({
      ok: true,
      user: newUser
    });
  })
})



//actualizar
app.put('/:id', verificaToken.verificaToken, (req,res, next) => {

  var id = req.params.id;
  var body = req.body;

  User.findById(id, (err, user) => {
    if(err){
      return res.status(500).json({
        ok: false,
        message: 'nerror al buscar usuario',
        error: err
      });
    }
    if(!user) {
      return res.status(404).json({
        ok: false,
        message: 'el usuario con el id' + id + 'no existe',
        error: err
      });
    }
    user.name = body.name;
    user.email = body.name;
    user.role = body.role;

    user.save((err, userUpdated) => {
      if(err){
        return res.status(400).json({
          ok: false,
          message: 'error al actualizar usuario',
          error: err
        });
      }
      res.status(200).json({
        ok: true,
        user: userUpdated
      });

    })
  });
});


//borrar un usuario por el id

app.delete('/:id',verificaToken.verificaToken, (req,res, next) => {
  var id =req.params.id;

  User.findByIdAndRemove(id, (err, userDeleted)=> {
    if(err){
      return res.status(500).json({
        ok: false,
        message: 'error al borrar usuario',
        error: err
      });
    }
    if(!userDeleted){
      return res.status(400).json({
        ok: false,
        message: 'no existe un usuario con ese id',
        error: {message: 'no existe'}
      });
    }
    res.status(200).json({
      ok: true,
      user: userDeleted
    });

  })

})

//verificar jsonwebtoken

module.exports = app;
