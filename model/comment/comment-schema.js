const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const commentSchema = new Schema({
  post_id: String,
  body: String,
  rating: Number,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
