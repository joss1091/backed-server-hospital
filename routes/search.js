var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');


//busqueda general
app.get('/all/:word', (req, res, next)=> {

  var busqueda = req.params.word;
  var regex = new RegExp(busqueda, 'i');

 Promise.all([
   buscarHospitales(busqueda,regex),
   buscarMedicos(busqueda,regex),
   buscarUsuarios(busqueda,regex)
 ])
 .then( respuestas => {
   res.status(200).json({
     ok: true,
     hospitals: respuestas[0],
     doctors: respuestas[1],
     users: respuestas[2]
   })
 })




});

app.get('/collection/:table/:word',(req,res,next)=> {
  var busqueda = req.params.word;
  var regex = new RegExp(busqueda, 'i');
  var table = req.params.table;
  var promesa;
  switch (table) {
    case 'users':
      promesa = buscarUsuarios(busqueda,regex);
      break;
    case 'hospitals':
      promesa= buscarHospitales(busqueda,regex);
      break;
    case 'doctors':
      promesa = buscarMedicos(busqueda,regex);
      break;
    default:
      return res.status(401).json({
        ok: false,
        message: 'no existe la coleccion'
      });



  }
  promesa.then(data => {
    res.status(200).json({
      ok: true,
      [table]: data
    })
  })
})

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) =>{
    Hospital.find({name: regex})
    .populate('user', 'name email')
    .exec((err, hospitals) => {
      if(err) {
        reject();
      }else{
        resolve(hospitals)
      }
    })
  })

}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) =>{
    Doctor.find({name: regex})
    .populate('hospital')
    .populate('user', 'name email')
     .exec((err, doctors) => {
      if(err) {
        reject();
      }else{
        resolve(doctors)
      }
    })
  })

}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) =>{
    User.find({}, 'name email role')
            .or([{ 'name': regex}, { 'email': regex}])
            .exec((err, users) =>{
              if(err){
                reject()
              }else{
                resolve(users)
              }
            })
  })

}
module.exports = app;
