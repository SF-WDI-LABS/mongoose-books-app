# Sprint 2 - relationships & referenced data

## 1. You enter a vast building full of books.

1. **If you have successfully completed all of sprint 1, you may skip to the next instruction.** If not, please checkout the solution branch using `git checkout solution-sprint-1` so that you can start working on this second sprint. (You need to have all the changes in your current branch committed to checkout a new branch.) At this point, you should have a node app set up to serve data about books and even allow users to add books, change them, and delete them. Look through any code in `server.js` and in the `models` directory that's new to you.

1. In order to work on a branch with a new more appropriate name, use the command `git checkout -b my-work-sprint-2`. This will create a new branch starting from the commit that you were previously on.

1. Startup the server, open up your browser, and move forward with the instructions.

## 2. More than just a piece of text!

We have authors listed as just a string inside books, but what happens if we want to store more than just an author's name?  Let's create a separate model for authors.  

1. Create a new file `models/author.js`.

2. Authors will get attributes for `name`, `alive`, and `image`.  Create a schema for authors with those three attributes.

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

    // models/author.js
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var AuthorSchema = new Schema({
      name: String,
      // you should fill the rest of this in
    });


  </details>
<br>

3. Next, create an `Author` model from the schema.  

  <details><summary>Stuck figuring out what code to include? Click here.</summary>

    // models/author.js
    var Author = mongoose.model('Author', AuthorSchema);

  </details>

<br>

4. Now, export your Author model.

  <details><summary>Stuck figuring out what code to include? Click here.</summary>


  // models/author.js
  module.exports = Author;

  </details>

<br>

> Now, if another file inside the `models` directory used `require('./author.js')`, it would have access to the `Author` model exported here!

5. We exported the `Author` model so it's available elsewhere, but now we need to `require` it in the other file(s) that will use it.  We're grouping all our models in `models/index.js`, so add a line to that file to bring in the new `Author` model.  Also add the `Author` model to the `models/index.js` module exports. If you'd like, you can do both in the same line!

  <details><summary>Stuck figuring out what code to include? Click here.</summary>


    module.exports.Author = require("./author.js");


  </details>


> Now since we `require('./models')` in `server.js`, `server.js` automatically gains access to _both_ the `Book` database model _and_ the `Author` database model.  In fact, the object brought in with `require('./models')` will be exactly this:

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

## 4. Authors, assemble!

1. We have all the tools we need to start making authors.  Add the following data to your `seed.js` file.
<!-- Then add a call to `db.Author.remove` to delete all the old authors, and inside it add a call to `db.Author.create` to create new authors. -->

  <details><summary>Expand this section for author seed data.</summary>

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


  </details>

2. Now we need edit our `seed.js` file to create books and authors being sure to connect the two together. Remove all the other functions and replace with:

  <details><summary>Click to view monstrosity</summary>


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


  </details>

<img src="http://i.imgur.com/ONjGv69.png" width="300px">

3. Run `node seed.js` in your terminal again to re-add the books and add the new authors.

## 5. Reroute!

Some of our book-related routes won't work anymore since we changed the structure of our data.

1. On to `server.js`! Try to change over your routes to use the new structure of books and authors. If you get stuck, here's  code to get you started on changing over a few routes:

<details><summary>Spoilers on new route structure:</summary>

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


</details>

## 6. But the view from here is bad!
1. When you look at your view, instead of seeing the nicely listed author, you might see the "stringified" author object.
![author object](https://cloud.githubusercontent.com/assets/3010270/14153137/6c0b4432-f66b-11e5-9440-b122c471e746.png)

1. Why is this? Look at the data being returned from the server and, if needed, fix your template string to show the author name!

<details><summary>click for a hint</summary>

```
<p>
  <b>${book.title}</b>
  <!-- this next line is what needs to be changed! -->
  by ${book.author.name}
  <button type="button" name="button" class="deleteBtn btn btn-danger pull-right" data-id=${book._id}>Delete</button>
</p>
```
</details>



## Challenge!

On your own, use the mongoose methods to replace the other `/api/books*` routes with mongoose commands, taking into account the new referenced data relationship. Most importantly, update the `POST /api/books` route so that it checks if the author already exists (`.find()` an author) before creating a new book. If the author exists, go ahead and create the book. If the author doesn't yet exist, you'll need to create the author document before creating the book that references it.

Make sure you look back to the lecture notes for info on the most important methods like:
* `find`
* `findOneAndRemove`
* `new`
* `save`
