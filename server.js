// server.js
// SERVER SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

// Allow CORS: we'll use this today to reduce security so we can more easily test our code in the browser.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// serve static files in public
app.use(express.static('public'));


// server.js
var albums = [
  { title: 'Cupid Deluxe',
    artist: 'Blood Orange'
  },
  { title: 'M3LL155X - EP',
    artist: 'FKA twigs'
  },
  { title: 'Fake History',
    artist: 'letlive.'
}];





app.get('/api/albums', function(req,res) {
  res.json(albums);
});


// define a root route: localhost:3000/
app.get('/', function (req, res) {
  // send the text 'Hello World!' when someone visits localhost:3000/
  console.log('req = ', req);
  console.log('res = ', res);

  //res.send('Hello World!');
  res.sendFile('index.html' , { root : __dirname});
});

// listen for connections on port 3000 or a port set in process.env.PORT
var server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
