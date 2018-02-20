var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;



var doctorSchema= new Schema({
  name: {type: String, required: [true, 'el nombre es necesario']},
  image: {type: String, required: false},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  hospital: {type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'el id hospital es obligatorio']}

});

module.exports = mongoose.model('Doctor', doctorSchema);
