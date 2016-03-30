# Sprint A - mongoDB & mongoose

## 1. You awake inside a new app and look around.

1. Take a few minutes to familiarize yourself with your surroundings and navigate the file structure of this app.  You should see a few routes listed in `server.js`; a basic front-end using them, a few files in public including your front-end JavaScript.  
  > "Hmm", you think to yourself, "this app seems to be a books app."

1. Open up your browser and startup the server.  Take a look at the books on the front-end.
  > You didn't forget to `npm install` did you?

## 2. OK server.js, let's see what you've got?!

1. Open up `server.js` and take a look at the hard-coded books data.  You should see a list of book objects in there.
1. You should also already see that there are routes to create (POST) new books, get a list of books (GET index), get a single book (GET show) and edit and delete books.  -- Plus they're all using that array.  

## 3. Outgrowing Array's as a datastore.

Array's are no longer adequate as a data-store.  They lose their data whenever the server is shut-down, they don't support backups unless you copy the file and new elements never get saved in the file.  Plus all the cool kids are using databases not arrays.

Let's replace that array with a database.  We'll create a booksSchema and Books model.  

First off let's setup mongo and mongoose.  

1. Install mongoose into this repo's package.json: `npm install --save mongoose`
1. Create a new file `models/book.js`

1. Our books will have the following attributes:
  * title
  * author
  * image (use a string for this)
  * releaseDate

  Let's create a schema using these properties.  I'll get you started:

  ```js
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var BookSchema = new Schema({
       title: String,
      // you should fill the rest of this in
   });
  ```

1. Next let's create the `Book` model from the schema.  
  ```js
  var Book = mongoose.model('Book', BookSchema);
  ```

1. Finally we'll need to export this **module** (that's this file).  You can export it at the very end of the file by doing:
  ```js
  var Book = mongoose.model('Book', BookSchema);

  module.exports = Book;
  ```

1. We've already provided a `models/index.js` for you to use.  If you take a look in there you should already see that it
  1. requires mongoose
  1. connects to a book-app database

1. `index.js` will import each model and export an object called `exports` with keys representing each of our models.  That way we can import the entire directory and get all of our models!  

  <details><summary>Here's an example:</summary>

    <pre>

    ├── models
    │   ├── index.js
    │   ├── gargoyle.js
    │   ├── gnome.js
    │   ├── goblin.js
    </pre>

    Inside `index.js` we require each of the other files and export it as one object:

    ```js
    // models/index.js
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/book-app");

    module.exports.Gargoyle = require("./gargoyle.js");
    module.exports.Goblin = require("./goblin.js");
    module.exports.Gnome = require("./gnome.js");
    ```
    
 </details>

## Verifying that this is working

1. Try running `node seed.js` in your terminal.
  If you're not seeing `created X books` then something might be going wrong.  

  <details><summary>Spoiler: book.js</summary>
  ```js
  var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

  mongoose.connect("mongodb://localhost/book-app");

  var BookSchema = new Schema({
    title: String,
    author: String,
    image: String,
    release_date: String
  });

  var Book = mongoose.model('Book', BookSchema);

  module.exports = Book;
  ```
  </details>

1. Try to debug, and if you're stuck ask for help.
