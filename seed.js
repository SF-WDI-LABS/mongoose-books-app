// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require('./models');

var books_list = [
  {
  id: 10,
  title: "To Kill a Mockingbird",
  author: "Harper Lee",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/to_kill_a_mockingbird.jpg",
  release_date: "July 11, 1960"
  },
  {
  id: 11,
  title: "The Great Gatsby",
  author: "F Scott Fitzgerald",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/great_gatsby.jpg",
  release_date: "April 10, 1925"
  },
  {
  id: 12,
  title: "Les Miserables",
  author: "Victor Hugo",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/les_miserables.jpg",
  release_date: "Unknown 1862"
  },
  {
  id: 13,
  title: "Around the World in 80 Days",
  author: "Jules Verne",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/around_the_world_in_80_days.jpg",
  release_date: "January 30, 1873"
  },
  {
  id: 14,
  title: "Lean In",
  author: "Sheryl Sandberg",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/lean_in.jpg",
  release_date: "March 11, 2013"
  },
  {
  id: 15,
  title: "The Four Hour Workweek",
  author: "Tim Ferriss",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
  release_date: "April 1, 2007"
  },
  {
  id: 16,
  title: "Of Mice and Men",
  author: "John Steinbeck",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
  release_date: "Unknown 1937"
  },
  {
  id: 17,
  title: "Romeo and Juliet",
  author: "William Shakespeare",
  image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
  release_date: "Unknown 1597"
  }
];

db.Book.remove({}, function(err, books){

  db.Book.create(books_list, function(err, books){
    if (err) { return console.log(err); }
    console.log("created", books.length, "books");
    process.exit();
  });

});
