var twitterKeys = require('./keys.js');

var request = require('request');
var twitter = require('twitter');

var command = process.argv[2];

switch (command) {
  case 'my-tweets':
    tweetIt();
    break;
  case 'spotify-this-song':
    spotifyIt();
    break;
  case 'movie-this':
    movieIt();
    break;
  case 'do-what-it-says':
    doIt();
    break; 
}

function tweetIt() {
  console.log('tweetIt');
}
function spotifyIt() {
  console.log('spotifyIt');
}
function movieIt() {
  console.log('movieIt');
}
function doIt() {
  console.log('doIt');
}