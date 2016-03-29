// server.js
// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express'),
  controllers = require('./controllers');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', controllers.books.index);

// get one book
app.get('/api/books/:id', controllers.books.show);

// create new book
app.post('/api/books', controllers.books.create);

// update book
app.put('/api/books/:id', controllers.books.update);

// delete book
app.delete('/api/books/:id', controllers.books.destroy);

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
