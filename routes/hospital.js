var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var verificaToken = require('../middlewares/autenticacion')


app.get('/', (req, res, next) => {
  Hospital.find({}, (error, hospital) => {
      if(error) {
        return res.status(500).json({
          ok: false,
          message: 'error cargando hospital',
          errors: error
        })
      }
      res.status(200).json({
        ok: true,
        hospital
      });
  })
})



//crear usuario
app.post('/', verificaToken.verificaToken,(req,res, next) => {
  var body = req.body;
  var hospital = new Hospital({
    name: body.name,
    image: body.image,
    user: req.user._id
  });
  hospital.save((err, newHospital) => {
    if(err){
      return res.status(400).json({
        ok: false,
        message: 'error al crear hospital',
        error: err
      });
    }
    res.status(201).json({
      ok: true,
      hospital: newHospital
    });
  })
});



//actualizar
app.put('/:id', verificaToken.verificaToken, (req,res, next) => {

  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if(err){
      return res.status(500).json({
        ok: false,
        message: 'nerror al buscar hospital',
        error: err
      });
    }
    if(!hospital) {
      return res.status(404).json({
        ok: false,
        message: 'el hospital con el id' + id + 'no existe',
        error: err
      });
    }
    hospital.name = body.name;
    hospital.image = body.image;
    hospital.user = req.user._id;

    hospital.save((err, hospitalUpdated) => {
      if(err){
        return res.status(400).json({
          ok: false,
          message: 'error al actualizar hospital',
          error: err
        });
      }
      res.status(200).json({
        ok: true,
        hospital: hospitalUpdated
      });

    })
  });
});


//borrar un usuario por el id

app.delete('/:id',verificaToken.verificaToken, (req,res, next) => {
  var id =req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalDeleted)=> {
    if(err){
      return res.status(500).json({
        ok: false,
        message: 'error al borrar hospital',
        error: err
      });
    }
    if(!hospitalDeleted){
      return res.status(400).json({
        ok: false,
        message: 'no existe un hospital con ese id',
        error: {message: 'no existe'}
      });
    }
    res.status(200).json({
      ok: true,
      hospital: hospitalDeleted
    });

  })

})

//verificar jsonwebtoken

module.exports = app;
