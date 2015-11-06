var express = require('express');
var app = express();

app.set('view engine', 'hbs');

app.use(express.static('public'));

var myName = 'Web Development';

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
  }]

app.get('/', function (req, res) {
  res.render('index', {  name: myName, paintings: paintings });

  Handlebars.registerHelper('list', function(context, options) {
      var ret = "<ul>";

      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + "<li>" + options.fn(context[i]) + "</li>";
      }
    return ret + "</ul>";
  });
});


var server = app.listen(3000, function () {
var port = server.address().port;

  console.log('Example app listening on port %s', port);
});
