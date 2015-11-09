// SERVER SIDE JAVASCRIPT

var express = require('express');
var app = express();
var hbs = require('hbs');



app.set('view engine', 'hbs');
app.use(express.static('public'));

// seed data
var myName = "Ben";

// seed data for the albums
var myAlbums = [
    { title: 'Cupid Deluxe',
      artist: 'Blood Orange'
    },
    { title: 'M3LL155X - EP',
      artist: 'FKA twigs'
    },
    { title: 'Fake History',
      artist: 'letlive.'
  }];
// seed data for the taquerias
  var taquerias = [
      { name: "La Taqueria" },
      { name: "El Farolito" },
      { name: "Taqueria Cancun" }
    ];


// each helper method for hbs template
hbs.registerHelper('each', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }
	return ret;
});



// get the home route and return "Hello World!"
app.get('/', function (req, res) {
	res.render('index', { name: myName });
});

app.get('/albums', function(req, res) {
	res.render('albums', {albums: myAlbums});
});

app.get('/api/taquerias', function (req, res) {
	res.json(taquerias);
});


// in production use the production port, otherwise use 3000 (for development
var server = app.listen(process.env.PORT || 3000, function () {
	console.log("Example app listening at http://localhost:3000");
});
