# Sprint 3 - Embedded documents

## 1. Many unique characters belong to each book!

That's right we're going to add Characters to each of the books.
Characters however are usually pretty unique to the book that they're in, so we'll be using an **embedded** document; embedding `Character` into the `Book` schema.  

1. Startup the app making sure to `node seed.js` and `node server.js`.  
1. Take a look at the current UI in your web browser.  You should see that a new field has been added to each book listed.
1. Open your web browser developer tools.  Try to add a character to one of the books.  You should see an error message like: `jquery.min.js:4 POST http://localhost:3000/api/books/56fc1e8a8d4bcdb3e5e0092e/characters 404 (Not Found)`
  * What type of error is 404?


## 2. Creating the CharacterSchema

Since Characters will be embedded we can create it's schema either in its own file or in the same file as the document it will be embedded in.  Let's keep it simple this time; and create it in the the `models/book.js`.  

1. Add the CharacterSchema to `models/book.js` with one `name` attribute (keeping it simple for now).

  ```js
  // models/book.js
  var CharacterSchema = new Schema({
    name: String
  });
  ```

1. Now take a look at the `BookSchema` find the part where it has the array of characters.  Let's replace that string with our new schema.

  ```js
  //models/book.js
  // change this
  characters: [String]
  ```

  Do you remember how to access an embedded Schema?  

  <details><summary>don't remember?  click here</summary>
    ```js
    characters: [CharacterSchema]
    ```
  </details>




## 3. POST characters

At this point your Book model should be making use of Characters.  But since we haven't added anything to `server.js` yet, those characters can't be added by users and stored in the DB.

Since characters are part of Books we'll setup our URLs to reflect that.  

Example:

| METHOD  | ROUTE   | DESCRIPTION |
| ------- | --------------------------| ----------------|
| GET     | /books/:bookId/characters | get all the characters for this book |
| POST    | /books/:bookId/characters | add a new character to the book      |
| GET     | /books/:bookId/characters/:id | get a specific character from this book |
| PUT     | /books/:bookId/characters/:id | update a  character from this book |
| DELETE  | /books/:bookId/characters/:id | delete a character from this book |


We don't need all of these today; in fact we're only really going to worry about adding characters for now.


1. Add a new route to server.js:

  ```js
  app.post('/api/books/:book_id/characters', function (req, res)
  ```


1. See if you can get the book (`findById`) and then push the character into the book's `characters` array.  If the format fits, Mongoose will convert the object to a Character for you.  Finally you need to save the book and return the entire book as json.  (note that author is still a part of this so you'll need to populate it too.)

  Let's use this psuedo-code as an example:

  ```js
  // Create a character associated with a book
  app.post('/api/books/:book_id/characters', function (req, res) {
    // Get book id from url params (`req.params`)
    var bookId = req.params.book_id;
    db.Book.findById(bookId)
      .populate('author')
      .exec(function(err, foundBook) {
        // handle errors
        // push req.body into characters array

        // save the book with the new character
        // send the entire book back
        }
      }
    );
  });
  ```



  <details><summary>Spoiler</summary>

    ```js
    // Create a character associated with a book
    app.post('/api/books/:book_id/characters', function (req, res) {
      // Get book id from url params (`req.params`)
      var bookId = req.params.book_id;
      db.Book.findById(bookId)
        .populate('author') // Reference to author
        // now we can worry about saving that character
        .exec(function(err, foundBook) {
          console.log(foundBook);
          if (err) {
            res.status(500).json({error: err.message});
          } else if (foundBook === null) {
            // Is this the same as checking if the foundBook is undefined?
            res.status(404).json({error: "No Book found by this ID"});
          } else {
            // push character into characters array
            foundBook.characters.push(req.body);
            // save the book with the new character
            foundBook.save();
            res.status(201).json(foundBook);
          }
        }
      );
    });
    ```
  </details>


## 4. Does it work yet?  Does it work yet?

1. Give it a shot now; the UI should just work.  If not make use of debugger or console.log messages to try and resolve any issues.  

1. We haven't pre-built any UI to make use of embed anywhere else, but if you have spare time you could try to work on the server-side for GET characters or DELETE characters.  Maybe you can even add a delete button to the UI next to each character.  
