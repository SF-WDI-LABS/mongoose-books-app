console.log("Sanity Check: JS is working!");
var $booksList;
var allBooks = [];

$(document).ready(function(){

  $booksList = $('#bookTarget');

  $.ajax({
    method: 'GET',
    url: '/api/books',
    success: handleSuccess,
    error: handleError
  });

  $('#newBookForm').on('submit', function(e) {
    e.preventDefault();
    console.log('new book serialized', $(this).serializeArray());
    $.ajax({
      method: 'POST',
      url: '/api/books',
      data: $(this).serializeArray(),
      success: newBookSuccess,
      error: newBookError
    });
  });

  $booksList.on('click', '.deleteBtn', function() {
    console.log('clicked delete button to', '/api/books/'+$(this).attr('data-id'));
    $.ajax({
      method: 'DELETE',
      url: '/api/books/'+$(this).attr('data-id'),
      success: deleteBookSuccess,
      error: deleteBookError
    });
  });

  $booksList.on('click', '.edit-book-button', function() {
    console.log('clicked edit button');
    $(this).parent().find(".edit-input").show();

  });

  $booksList.on('click', '.edit-book-submit-button', function() {
    $(this).parent().hide();
    let newTitle = $(this).parent().find("input").val();
    $.ajax({
      method: "PUT",
      url: `/api/books/${ $(this).attr('data-id') }`,
      data: { title: newTitle },
      success: (book) => {
        $(this).parent().parent().find(".book-title").html(book.title);
      }
    })

  })

  $booksList.on('submit', '#addCharacterForm', function(e) {
    e.preventDefault();
    console.log('new characters');
    $.ajax({
      method: 'POST',
      url: '/api/books/'+$(this).attr('data-id')+'/characters',
      data: $(this).serializeArray(),
      success: newCharacterSuccess,
      error: newCharacterError
    });
  });

  $booksList.on('click', '.deleteCharacter', function() {
    $.ajax({
      method: 'DELETE',
      url: '/api/books/'+$(this).data('bookid')+'/characters/'+$(this).data('charid'),
      success: deleteCharacterSuccess,
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  });

});

function getCharacterHtml(_book_id, character) {
  return `${character.name} <button class="deleteCharacter btn btn-danger" data-bookid=${_book_id} data-charid=${character._id}><b>x</b></button>`;
}

function getAllCharactersHtml(_book_id, characters) {
  return characters.map(function(character) {
              return getCharacterHtml(_book_id, character);
            }).join("");
}

function getBookHtml(book) {
  return `<hr>
          <p>
            <b class="book-title">${book.title}</b>
            <span class="edit-input" style="display: none">
              <input type="text" value="${book.title}" />
              <button class="edit-book-submit-button" data-id="${book._id}">Save</button>
            </span>
            by ${(book.author) ? book.author.name : 'null'}
            <button class="edit-book-button">Edit</button>
            <br>
            <b>Characters:</b>
            ${getAllCharactersHtml(book._id, book.characters)}
            <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${book._id}>Delete</button>
          </p>
          <form class="form-inline" id="addCharacterForm" data-id=${book._id}>
            <div class="form-group">
              <input type="text" class="form-control" name="name" placeholder="Book character">
            </div>
            <button type="submit" class="btn btn-default">Add character</button>
          </form>
          `;
}

function getAllBooksHtml(books) {
  return books.map(getBookHtml).join("");
}

// helper function to render all posts to view
// note: we empty and re-render the collection each time our post data changes
function render () {
  // empty existing posts from view
  $booksList.empty();

  // pass `allBooks` into the template function
  var booksHtml = getAllBooksHtml(allBooks);

  // append html to the view
  $booksList.append(booksHtml);
}

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
  console.log('newbook error!');
}

function deleteBookSuccess(json) {
  var book = json;
  console.log(json);
  var bookId = book._id;
  console.log('delete book', bookId);
  // find the book with the correct ID and remove it from our allBooks array
  for(var index = 0; index < allBooks.length; index++) {
    if(allBooks[index]._id === bookId) {
      allBooks.splice(index, 1);
      break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
    }
  }
  render();
}

function deleteBookError() {
  console.log('deletebook error!');
}

function newCharacterSuccess(json) {
  var book = json;
  var bookId = book._id;
  // find the book with the correct ID and update it
  for(var index = 0; index < allBooks.length; index++) {
    if(allBooks[index]._id === bookId) {
      allBooks[index] = book;
      break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
    }
  }
  render();
}

function newCharacterError() {
  console.log('adding new character error!');
}

function deleteCharacterSuccess(json) {
  var book = json;
  var bookId = book._id;
  // find the book with the correct ID and update it
  for(var index = 0; index < allBooks.length; index++) {
    if(allBooks[index]._id === bookId) {
      allBooks[index] = book;
      break;  // we found our book - no reason to keep searching (this is why we didn't use forEach)
    }
  }
  render();
}
