const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const authSchema = new Schema({
  login: String,
  password: String
});


module.exports = mongoose.model('Auth', authSchema);
