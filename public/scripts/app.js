console.log("Sanity Check: JS is working!");

$(document).ready(function(){


  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/api/albums',
    success: handleSuccess,
    error: handleError
  });


});


function handleSuccess(json) { 
  // takes an array of albums and renders them as an unordered list
  var albums = json;
  var outputHtml = '<ul>';
  albums.forEach(function(album) {
    outputHtml = outputHtml + "<li>" + album.artist + " -- " + album.title + "</li>";
  });
  outputHtml += '</ul>';
  $('#albumTarget').html(outputHtml);
}

function handleError(e) {
  console.log('uh oh');
  $('#albumTarget').text('Failed to load albums, is the server working?');
}
