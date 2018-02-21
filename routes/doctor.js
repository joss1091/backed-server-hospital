var express = require('express');
var app = express();
var Doctor = require('../models/doctor');
var verificaToken = require('../middlewares/autenticacion')


app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);
  Doctor.find({})
  .populate('user', 'name email')
  .populate('hospital')
  .skip(desde)
  .limit(5)
    .exec((error, doctor) => {
      if(error) {
        return res.status(500).json({
          ok: false,
          message: 'error cargando doctor',
          errors: error
        })
      }
      Doctor.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          doctor,
          total: conteo
        });
      })

  })
})



//crear usuario
app.post('/', verificaToken.verificaToken,(req,res, next) => {
  var body = req.body;
  var doctor = new Doctor({
    name: body.name,
    image: body.image,
    user: req.user._id,
    hospital: body.hospitalId
  });
  doctor.save((err, newDoctor) => {
    if(err){
      return res.status(400).json({
        ok: false,
        message: 'error al crear doctor',
        error: err
      });
    }
    res.status(201).json({
      ok: true,
      doctor: newDoctor
    });
  })
});



//actualizar
app.put('/:id', verificaToken.verificaToken, (req,res, next) => {

  var id = req.params.id;
  var body = req.body;

  Doctor.findById(id, (err, doctor) => {
    if(err){
      return res.status(500).json({
        ok: false,
        message: 'nerror al buscar doctor',
        error: err
      });
    }
    if(!doctor) {
      return res.status(404).json({
        ok: false,
        message: 'el doctor con el id' + id + 'no existe',
        error: err
      });
    }
    doctor.name = body.name;
    doctor.image = body.image;
    doctor.user = req.user._id;
    doctor.hospital = body.hospitalId

    doctor.save((err, doctorUpdated) => {
      if(err){
        return res.status(400).json({
          ok: false,
          message: 'error al actualizar doctor',
          error: err
        });
      }
      res.status(200).json({
        ok: true,
        doctor: doctorUpdated
      });

    })
  });
});


//borrar un usuario por el id

app.delete('/:id',verificaToken.verificaToken, (req,res, next) => {
  var id =req.params.id;

  Doctor.findByIdAndRemove(id, (err, doctorDeleted)=> {
    if(err){
      return res.status(500).json({
        ok: false,
        message: 'error al borrar doctor',
        error: err
      });
    }
    if(!doctorDeleted){
      return res.status(400).json({
        ok: false,
        message: 'no existe un doctor con ese id',
        error: {message: 'no existe'}
      });
    }
    res.status(200).json({
      ok: true,
      doctor: doctorDeleted
    });

  })

})

//verificar jsonwebtoken

module.exports = app;
