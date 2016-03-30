# Sprint 2 - relationships & referenced data

_HINT_: open Robomongo and refresh it regularly to check on your database items.

## 1. You enter a vast building full of books.

1. To start this sprint, checkout the correct branch (you need to have all the changes in your current branch checked in to checkout a new branch):
  ```
  git checkout starting-point-sprint-2
  ```

1. At this point, you should have a node app set up to serve data about books and even allow users to add books, change them, and delete them. Look through any code in `server.js` and in the `models` directory that's new to you.

1. Startup the server and open up your browser.  Take a look at the updated front-end.

## 2. More than just a piece of text!

We have authors listed as just a string inside books, but what happens if we want to store more than just an author's name?  Let's create a separate model for authors.  


1. Create a new file `models/author.js`.

1. Authors will get attributes for `name`, `alive`, and `image`.  Create a schema for authors like you did for books.

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

    ```js
    // models/author.js
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
    // models/author.js
    var Author = mongoose.model('Author', AuthorSchema);
    ```

  </details>



1. Now, export your Author model.

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

  ```js
  // models/author.js
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


  Now since we `require('./models')` in `server.js`, `server.js` automatically gains access to _both_ the `Book` database model _and_ the `Author` database model.  In fact, the object brought in with `require('./models')` will be exactly this:

  ```js
  { "Book": Book,  "Author": Author }
  ```

## 3. Whose book is it anyway?

Now we have a books model and authors has its own model. We want to relate them! Now we'll update books to store an author by reference instead of just storing the name.

Referencing authors is a good choice here because:
* many books might share the same author, and   
* we don't want to have to access every single one of an author's books just to make a change to the author's data.  


1. We'll need to update the book schema. Change the `author` line to store a reference to the author:

```js
var BookSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  },
  image: String,
  releaseDate: String
});
```
## 3. Authors, assemble!

1. We have all the tools we need to start making authors.  Add the following data to your `seed.js` file.
<!-- Then add a call to `db.Author.remove` to delete all the old authors, and inside it add a call to `db.Author.create` to create new authors. -->

  <details><summary>Expand this section for author seed data.</summary>

  ```js
  var authors_list = [
    {
      name: "Harper Lee",
      alive: false
    },
    {
      name: "F Scott Fitzgerald",
      alive: false
    },
    {
      name: "Victor Hugo",
      alive: false
    },
    {
      name: "Jules Verne",
      alive: false
    },
    {
      name: "Sheryl Sandberg",
      alive: true
    },
    {
      name: "Tim Ferriss",
      alive: true
    },
    {
      name: "John Steinbeck",
      alive: false
    },
    {
      name: "William Shakespeare",
      alive: false
    }
  ];

  ```
  </details>

1. Now we need edit our `seed.js` file to create books and authors being sure to connect the two together. Remove all the other functions and replace with:

  <details><summary>Click to view monstrosity</summary>

  ```js
  db.Author.remove({}, function(err, authors) {
    console.log('removed all authors');
    db.Author.create(authors_list, function(err, authors){
      if (err) {
        console.log(err);
        return;
      }
      console.log('recreated all authors');
      console.log("created", authors.length, "authors");


      db.Book.remove({}, function(err, books){
        console.log('removed all books');
        books_list.forEach(function (bookData) {
          var book = new db.Book({
            title: bookData.title,
            image: bookData.image,
            releaseDate: bookData.releaseDate
          });
          db.Author.findOne({name: bookData.author}, function (err, foundAuthor) {
            console.log('found author ' + foundAuthor.name + ' for book ' + book.title);
            if (err) {
              console.log(err);
              return;
            }
            book.author = foundAuthor;
            book.save(function(err, savedBook){
              if (err) {
                return console.log(err);
              }
              console.log('saved ' + savedBook.title + ' by ' + foundAuthor.name);
            });
          });
        });
      });

    });
  });
  ```


  ![](http://i.imgur.com/ONjGv69.png)
  </details>
1. Run `node seed.js` in your terminal again to re-add the books and add the new authors.

## 4. Changing your routes

1. Now on to `server.js`. Here's how to change over a few routes:

  ```js
  // get all books
  app.get('/api/books', function (req, res) {
    // send all books as JSON response
    db.Book.find()
      // populate fills in the author id with all the author data
      .populate('author')
      .exec(function(err, books){
        if (err) { return console.log("index error: " + err); }
        res.json(books);
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

    // this code will only add an author to a book if the author already exists
    db.Author.findOne({name: req.body.author}, function(err, author){
      newBook.author = author;
      // add newBook to database
      newBook.save(function(err, book){
        if (err) {
          return console.log("create error: " + err);
        }
        console.log("created ", book.title);
        res.json(book);
      });
    });

  });
  ```

## 5. But the view from here is bad!
1. When you look at your view, instead of seeing the nicely listed author, you should see the author object.
![author object](https://cloud.githubusercontent.com/assets/3010270/14153137/6c0b4432-f66b-11e5-9440-b122c471e746.png)

1. Why is this? Look at the data being returned from the server and fix your `html` to show the author name!

```html
<details><summary>Click to view hint</summary>
<p>
  <b>{{title}}</b>
  <!-- just this next line is what needs to be changed! -->
  by {{author.name}}
  <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id={{_id}}>Delete</button>
</p>
</details>
```



## Challenge!

On your own, use the mongoose methods to replace the other `/api/books*` routes with mongoose commands, taking into account the new referenced data relationship.

Make sure you look back to the lecture notes for info on the most important methods like:
* find
* findOneAndRemove
* new
* save
