//requires
var express = require('express');
var mongoose = require('mongoose');



//inicializar variables
var app = express();

//coneccion a bd
mongoose.connection.openUri('mongodb://localhost:27017/mongodb', (err, res) => {
  if(err) throw err;
  console.log("coneccion a bd exitosa");
})



//rutas
app.get('/', (req, res, next)=> {
  res.status(200).json({
    ok: true,
    message:" peticion realizada correctamente"
  });
})

//escuchar peticiones
app.listen(3000, () => {
  console.log('express server puerto 3000: \x1b[32m%s\x1b[0m',' online');
});
