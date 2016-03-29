var db = require('../models'),
  bookController = {};

bookController.index = function(req, res) {
  // send all books as JSON response
  db.Book.find(function(err, books){
    res.json(books);
  });
}


bookController.show = function(req, res) {
  // find one book by its id
  db.Book.findById(req.params.id, function(err, book){
    if (err) { return console.log("create error: " + err); }
    res.json(book);
  });

}

bookController.create = function(req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book(req.body);
  // add newBook to database
  newBook.save(function(err, book){
    if (err) { return console.log("create error: " + err); }
    console.log("created ", book.title);
    res.json(book);
  });
}



bookController.update = function(req, res) {
  // get book id from url params (`req.params`)
  var bookId = parseInt(req.params.id);

  // find book to update by its id
  var bookToUpdate = books.filter(function (book) {
    return book._id == bookId;
  })[0];

  // update the book's task
  bookToUpdate.task = req.body.task;

  // update the book's description
  bookToUpdate.description = req.body.description;

  // send back updated book
  res.json(bookToUpdate);
}


bookController.destory = function(req, res) {
  // get book id from url params (`req.params`)
  var bookId = parseInt(req.params.id);

  // find book to delete by its id
  var bookToDelete = books.filter(function (book) {
    return book._id == bookId;
  })[0];

  // remove book from `books` array
  books.splice(books.indexOf(bookToDelete), 1);

  // send back deleted book
  res.json(bookToDelete);
}


// add all our functions to the object we'll export
module.exports = bookController;
