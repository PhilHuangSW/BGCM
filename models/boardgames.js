const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardgameSchema = new Schema({
  title: String,
  designer: String,
  publisher: String,
  description: String,
  images: String
});

const Boardgame = mongoose.model('Boardgame', boardgameSchema);

module.exports = Boardgame;