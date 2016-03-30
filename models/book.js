var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Character = require('./character');

var BookSchema = new Schema({
  title: String,
  author: String,
  image: String,
  release_date: String,
  characters: [Character.schema]
});

var Book = mongoose.model('Book', BookSchema);

module.exports = Book;
