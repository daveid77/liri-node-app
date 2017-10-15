var twitterKeys = require('./keys.js');

var Twitter = require('twitter');
var request = require('request');

var command = process.argv[2];
var media = process.argv[3];

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

  var params = {screen_name: 'democracynow', count: 20};
  var client = new Twitter(twitterKeys);

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log('\nLast 20 Tweets from @' + params.screen_name + ': ');
      console.log('----------------')

      for (i = 0; i < tweets.length; i++) {
        console.log(i + 1);
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
        console.log('----------------')
      }
    }
  });

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