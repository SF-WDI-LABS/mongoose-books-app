var db = require('../models'),
  bookController = {};

bookController.index = function(req, res, next) {
  // send all books as JSON response
  console.log(db.Book);
  db.Book.find(function(err, books){
    res.json(books);
  });
}


bookController.show = function(req, res, next) {
  // find one book by its id
  db.Book.findById(req.params.id, function(err, book){
    if (err) { return console.log("create error: " + err); }
    res.json(book);
  });

}

bookController.create = function(req, res, next) {
  // set up new book with form data (`req.body`)
  var newBook = new db.Book(req.body);

  // save newBook to database
  newBook.save(function(err, book){
    if (err) { return console.log("save error: " + err); }
    console.log("saved ", book.title);
    res.json(book);
  });
}



bookController.update = function(req, res, next) {
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


bookController.destroy = function(req, res, next) {
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


// export the bookController object with all its functions
module.exports = bookController;
