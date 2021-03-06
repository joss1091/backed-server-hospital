//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')



//inicializar variables
var app = express();

//cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

//bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//importar rutas
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var loginRoutes = require('./routes/login');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');


//coneccion a bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, res) => {
  if(err) throw err;
  console.log("coneccion a bd exitosa");
})
// var mongoDB = 'mongodb://127.0.0.1/mongodb';
// mongoose.connect(mongoDB);
// // Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;
// //Get the default connection
// var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//server-index
// var serveIndex = require('serve-index')
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname +'/uploads'));

//rutas
app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/images', imagesRoutes);
app.use('/', appRoutes);

//escuchar peticiones
app.listen(3000, () => {
  console.log('express server puerto 3000: \x1b[32m%s\x1b[0m',' online');
});
