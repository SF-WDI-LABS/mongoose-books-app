var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/book-app");

module.exports.Book = require("./book.js");
module.exports.Character = require("./author.js");
