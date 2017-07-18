# Sprint 1 - mongoDB & mongoose

## 0. Set up your app

1. Fork and clone this repository.

2. Make a branch for your work using the command `git checkout -b my-work-sprint-1`. This branch will house the work that you have done on sprint 1.

## 1. You awake inside a new app and look around.

1. Take a few minutes to familiarize yourself with your surroundings and navigate the file structure of this app.  You should see a few routes listed in `server.js`; a basic front-end using them, a few files in public including your front-end JavaScript.  
  > "Hmm", you think to yourself, "this app seems to be a books app."

2. Open up your browser and startup the server.  Take a look at the books on the front-end.
  > You didn't forget to `npm install` did you?

## 2. OK server.js, let's see what you've got?!

1. Open up `server.js` and take a look at the hard-coded books data.  You should see an array of book objects in there called `books`.

2. You should also already see that there are routes to create (POST) new books, get a list of books (GET index), get a single book (GET show) and edit (PUT) and delete (DELETE) books.  -- Notice they're all manipulating the `books` array.  

## 3. Outgrowing Arrays as a datastore.

Arrays are no longer adequate as a data-store.  They lose their data whenever the server is shut down, they don't support backups unless you copy the file, and new elements never get saved in the file.  Plus, all the cool kids are using databases.

Let's replace that array with a database.  We'll create a booksSchema and Books model.  

First off let's setup mongo and mongoose.  

1. Install mongoose into this repo's package.json: `npm install --save mongoose`
2. Create a new file `models/book.js`. We'll create a schema and model for books in this file!

3. Our books will have the following attributes:
  * title
  * author
  * image (use a string for this)
  * releaseDate

  Let's create a schema using these properties.  I'll get you started:

  ```js
  // book.js
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var BookSchema = new Schema({
       title: String,
      // you should fill the rest of this in
   });
  ```

4. Next let's create the `Book` model from the schema.  
  ```js
  // book.js
  var Book = mongoose.model('Book', BookSchema);
  ```

5. Finally we'll need to export Book from this **module** (that's this file).  You can export it at the very end of the file by doing:
  ```js
  // book.js
  var Book = mongoose.model('Book', BookSchema);

  module.exports = Book;
  ```

## 4. Review: what are modules ?

1. We've already provided a `models/index.js` for you to use.  Examine it to see that it already:
  - requires mongoose  
  - connects to a local book-app database URI  

2. `index.js` will import each model and export an object called `exports` with keys representing each of our models.  That way we can `require` the entire directory and get all of our models!  Go ahead and import and export your `Book` model in `index.js`.

  ```js
  // models/index.js
  module.exports.Book = require("./book.js");
  ```

3. Now if someone were to `require('./models')` they'd gain access to this book database model.

Here's a module example:


      ├── models
      │   ├── index.js
      │   ├── gargoyle.js
      │   ├── gnome.js
      │   ├── goblin.js


Inside `index.js` we require each of the other files and export it as one object:

```javascript
// models/index.js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/book-app");   
// the mongoose.connect line above  needs to happen exactly once in your code
    // move it from book.js to index.js  :)

module.exports.Gargoyle = require("./gargoyle.js");
module.exports.Goblin = require("./goblin.js");
module.exports.Gnome = require("./gnome.js");
```

In the end this means that when you require `./models` in `server.js` you get back an object like
        `{ Gargoyle: Model, Goblin: Model, Gnome: Model }`



## 5. Verifying that this is working

1. Take a quick look in `seed.js`.  You should see that it does a `require('./models');` and then later uses `db.Book.create` to load some data into the database.  (You might also notice that it tries to clear the `book-app` database first by deleting all the records.)

**What's a seed-file, you ask?**
> A seed file is a file used to load pre-made data into our database.  It lets us start up our app without having to key in starter data each time.

2. Try running `node seed.js` in your terminal. If you're not seeing `created X books`, then something might be going wrong in your `book.js` file.  

  Here's an example of what your `book.js` could look like:

  ```js
  // entire book.js so far
  var mongoose = require('mongoose');

  var BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    image: String,
    release_date: String
  });

  var Book = mongoose.model('Book', BookSchema);

  module.exports = Book;
  ```

3. You can use the Mongo shell to check what's now in your database, or start interacting with it through the server files.  If you got an error message above, FIX IT BEFORE YOU MOVE ON.  If you're stuck, ask for help.


## 6. Connecting the database to the server

Next we'll start to use our new model in `server.js`.

1. Open `server.js`.  

2. Add the correct `require` statement to `server.js` to import your models module:  `var db = require('./models')`.  This should go near the top as part of the "SETUP and CONFIGURATION".

3. Delete the hard-coded books array.  We'll start to replace each route with the correct code to use the database instead.  From now on, when we want to get to a book, we'll use mongoose methods and access `db.Books`.

4. Find the books index route and replace it with the following code:

  ```js
  // server.js
  app.get('/api/books', function (req, res) {
    // send all books as JSON response
    db.Book.find(function(err, books){
      if (err) {
        console.log("index error: " + err);
        res.sendStatus(500);
      }
      res.json(books);
    });
  });
  ```

5. Restart your server. Debug any error messages you see.

6. If you've successfully seeded your database and debugged your code, you should see all the books from `seed.js` when you refresh the page.


## 7. Challenge!

On your own, use mongoose CRUD methods to refactor the other `/api/books*` routes to get data from your database.

Make sure you look back to the notes or the Mongoose documentation for info on important methods like:

* `find`
* `findOneAndRemove`
* `new`
* `save`
