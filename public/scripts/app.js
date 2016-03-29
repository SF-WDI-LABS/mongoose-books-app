console.log("Sanity Check: JS is working!");
var template;
var $booksList;
var allBooks = [];

$(document).ready(function(){

  $booksList = $('#bookTarget');

  // compile handlebars template
  var source = $('#books-template').html();
  template = Handlebars.compile(source);

  $.ajax({
    method: 'GET',
    url: '/api/books',
    success: handleSuccess,
    error: handleError
  });

  $('#newBookForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/books',
      data: $(this).serialize(),
      success: newBookSuccess,
      error: newBookError
    });
  });

  $booksList.on('click', '.deleteBtn', function() {
    console.log('hi')
    $.ajax({
      method: 'DELETE',
      url: '/api/books/'+$(this).attr('data-id'),
      success: deleteBookSuccess,
      error: deleteBookError
    });
  });

});

// helper function to render all posts to view
// note: we empty and re-render the collection each time our post data changes
function render () {
  // empty existing posts from view
  $booksList.empty();

  // pass `allBooks` into the template function
  var booksHtml = template({ books: allBooks });

  // append html to the view
  $booksList.append(booksHtml);
};

function handleSuccess(json) {
  allBooks = json;
  render();
}

function handleError(e) {
  console.log('uh oh');
  $('#bookTarget').text('Failed to load books, is the server working?');
}

function newBookSuccess(json) {
  $('#newBookForm input').val('');
  allBooks.push(json);
  render();
}

function newBookError() {

}

function deleteBookSuccess(json) {
  var book = json;
  var bookId = book._id;
  // find the book to delete by its id
  var bookToDelete = allBooks.filter(function (book) {
    console.log(book._id + bookId)
    return book._id == bookId;
  });
  console.log('delete', bookToDelete);
  console.log('book',book)
  console.log('all', allBooks.indexOf(bookToDelete))
  // remove deleted book from all books
  allBooks.splice(allBooks.indexOf(book), 1);
  render();
}

function deleteBookError() {

}
