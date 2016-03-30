var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: String,
  alive: Boolean,
  image: String
});

var Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;
