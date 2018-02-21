var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

var fs = require('fs');

app.use(fileUpload());

app.get('/', (req, res, next)=> {
  res.status(200).json({
    ok: true,
    message:" peticion realizada correctamente"
  });
})


app.put('/:type/:id', (req, res, next) => {
  var type = req.params.type;
  var id = req.params.id;

  var typesValid = ['hospitals', 'doctors', 'users'];
  if(typesValid.indexOf(type) < 0){
    return res.status(500).json({
      ok: false,
      message: 'tipo invalido',
      errors: { message: 'debe seleccionar un tipo valido' + typesValid.join(',')}
    })
  }
  if(!req.files){
    return res.status(500).json({
      ok: false,
      message: 'no selecciono nada',
      errors: { message: 'debe seleccionar un archivo'}
    })
  }
  //obetenr informacion del archivo
  let image = req.files.image;
  var nombreCortado = image.name.split('.');
  var extension = nombreCortado[nombreCortado.length -1];
  //extenciones permitidas
  var extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg']

  if(extensionesValidas.indexOf(extension ) < 0 ){
    return res.status(400).json({
      ok: false,
      message: 'extension no validad',
      errors: { message: 'estenciones permitidas ' + extensionesValidas.join(',')}
    })
  }

  //nombre del archivo personalizado
  //idUsuario-numerorando.extension
  var nameFile = `${ id}-${ new Date().getMilliseconds()}.${extension}`;

  //mover el archivo de un temporal
  var path = `./uploads/${type}/${nameFile}`;
  image.mv(path, err => {

    if(err){
      return res.status(500).json({
        ok: false,
        message: 'Error al mover el archivo',
        errors: err
      });
    }

    subirPorTipo(type,id, nameFile, res);
    // return res.status(200).json({
    //   ok: true,
    //   message: 'archivo movido correctamente',
    //   errors: { message: extension}
  })



  })





function subirPorTipo(tipo, id, nombreArchivo, res){


  switch (tipo) {

    case 'users':
      User.findById(id, (err, user) => {
        if(user){
          var pathViejo = './uploads/users/'+ user.image;
          if(fs.existsSync(pathViejo)){
            fs.unlink(pathViejo);
          }
          user.image = nombreArchivo;
          user.save((err, userUpdated)=> {
            return res.status(200).json({
              ok: true,
              message: 'imagen de usuario actualizada',
              user: userUpdated
            })
          })
        }else{
          res.status(400).send('no se encontro');
        }

      });
      break;
      case 'hospitals':
        Hospital.findById(id, (err, hospital) => {
          if(hospital){
            var pathViejo = './uploads/hospitals/'+ hospital.image;
            if(fs.existsSync(pathViejo)){
              fs.unlink(pathViejo);
            }
            hospital.image = nombreArchivo;
            hospital.save((err, hospitalUpdated)=> {
              return res.status(200).json({
                ok: true,
                message: 'imagen de hospital actualizada',
                hospital: hospitalUpdated
              })
            })
          }else{
            res.status(400).send('no se encontro');
          }

        });
        break;
        case 'doctors':
          Doctor.findById(id, (err, doctor) => {
            if(doctor){
              var pathViejo = './uploads/doctors/'+ doctor.image;
              if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
              }
              doctor.image = nombreArchivo;
              doctor.save((err, doctorUpdated)=> {
                return res.status(200).json({
                  ok: true,
                  message: 'imagen de doctor actualizada',
                  doctor: doctorUpdated
                })
              })
            }else{
              res.status(400).send('no se encontro');
            }

          });
          break;
    default:

  }
}
module.exports = app;
