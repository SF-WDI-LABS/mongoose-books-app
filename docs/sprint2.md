# Sprint B - relationships & referenced data

## 1. You enter a vast building full of books.

1. At this point, you should have a node app set up to serve data about books and even allow users to add books, change them, and delete them. Look through any code in `server.js` and in the `models` directory that's new to you.

1. Open up your browser and startup the server.  Take a look at the updated front-end.

## 2. More than just a piece of text!

We have authors listed as just a string inside books, but what happens if we want to store more than just an author's name?  Let's create a separate model for authors.  


1. Create a new file `models/author.js`.

1. Authors will at least need a name attribute.  Create a schema for authors like you did for books.

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

    ```js
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var AuthorSchema = new Schema({
         name: String,
        // you should fill the rest of this in
     });
    ```
  </details>


1. Next, create an `Author` model from the schema.  

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

    ```js
    var Author = mongoose.model('Author', AuthorSchema);
    ```

  </details>



1. Now, export your Author model.

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

  ```js
  module.exports = Author;
  ```

  </details>

  Now if another file inside the `models` directory used `require('./author.js')`, it would have access to the `Author` model exported here!

1. We exported the `Author` model so it's available elsewhere, but now we need to `require` it in the other file(s) that will use it.  We're grouping all our models in `models/index.js`, so add a line to that file to bring in the new `Author` model.  Also add the `Author` model to the `models/index.js` module exports. If you'd like, you can do both in the same line!

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

  ```js
  module.exports.Author = require("./author.js");
  ```

  </details>


  Now if someone were to `require('./models')` they'd gain access to _both_ the `Book` database model _and_ the `Author` database model.  In fact, the object brought in with `require('./models')` will be exactly this:

  ```js
  { "Book": Book,  "Author": Author }
  ```

## 3. It's alive!

1. We have all the tools we need to start making authors.  Add the following data to your `seed.js` file. Then add a call to `db.Author.remove` to delete all the old authors, and inside it add a call to `db.Author.create` to create new authors.

  <details><summary>Expand this section for author seed data.</summary>

  ```js
  var authors_list = [
    {
      name: "Harper Lee"
    },
    {
      name: "F Scott Fitzgerald"
    },
    {
      name: "Victor Hugo"
    },
    {
      name: "Jules Verne"
    },
    {
      name: "Sheryl Sandberg"
    },
    {
      name: "Tim Ferriss"
    },
    {
      name: "John Steinbeck"
    },
    {
      name: "William Shakespeare"
    }
  ];

  ```
  </details>

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

  ```js
  db.Author.remove({}, function(err, authors) {
    db.Author.create(authors_list, function(err, authors){
      if (err) { return console.log(err); }
      console.log("created", authors.length, "authors");
      process.exit();
    });
  });
  ```

  </details>

1. Run `node seed.js` in your terminal again to re-add the books and add the new authors.


## 4. Whose book is it anyway?

We have books and our new, more complex authors.  But they're not related yet. Now we'll update books to store an author by reference instead of just storing the name.

Referencing authors is a good choice here because:
  * many books might share the same author, and   
  * we don't want to have to access every single one of an author's books just to make a change to the author's data.  


1. We'll need to update the book schema. Change the `author` line to store a reference to the author:

  ```js
  var BookSchema = new Schema({
    title: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author'},
    image: String,
    releaseDate: String
  });
  ```

1. Now that books need an object id for `author` instead of a string, we'll have to change up how we're creating books throughout the app.  Start with `seed.js`:

  ```js
  db.Book.remove({}, function(err, books){
    books_list.forEach(function createBookWithAuthor(bookData){
      var book = new Book({
        title: bookData.title,
        image: bookData.image,
        releaseDate: bookData.releaseDate
      });
      db.Author.findOne({name: bookData.name}, function saveBookWithAuthor(err, foundAuthor){
        if (err) { return console.log(err); }
        book.author = foundAuthor;
        book.save(function(err, savedBook){
          if (err) { return console.log(err); }
          console.log('saved ' + savedBook.title + ' by ' + foundAuthor.name);
        });
      });
    });
  });
  ```

1. Now on to `server.js`. Here's how to change over a few routes:

  ```js
  // get all information for one book
  app.get('/api/books/:id', function (req, res) {
    // find one book by its id
    db.Book.findById(req.params.id)
      .populate('author')
      .exec(function(err, book){
        if (err) { return res.status(500).send(err); }
        res.json(book);
      });

  });

  // create new book
  app.post('/api/books', function (req, res) {
    // create new book with form data (`req.body`)
    var newBook = new db.Book({
      title: req.body.title,
      image: req.body.image,
      releaseDate: req.body.releaseDate,
    });

    db.Author.findOne({name: req.body.author}, function(err, author){
      newBook.author = author;
      // add newBook to database
      newBook.save(function(err, book){
        if (err) { return console.log("create error: " + err); }
        console.log("created ", book.title);
        res.json(book);
      });
    });

  });
  ```


## Challenge!

On your own, use the mongoose methods to replace the other `/api/books*` routes with mongoose commands.

Make sure you look back to the lecture notes for info on the most important methods like:
* find
* findOneAndRemove
* new
* save
