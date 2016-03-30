var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Character = require('./character');

var BookSchema = new Schema({
  title: String,
  author: String,
  image: String,
  releaseDate: String,
  characters: [Character.schema]
});

var Book = mongoose.model('Book', BookSchema);

module.exports = Book;
