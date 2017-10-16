var appKeys = require('./keys.js');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var media = process.argv[3];

var limit = 20; // Same limit used for Twitter and Spotify


// Setting switch in function allows it to be called after load
function switchIt() {
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
}
switchIt(); 


// TWITTER 

function tweetIt() {

  var params = {screen_name: 'democracynow', count: limit};
  var client = new Twitter(appKeys.twitterKeys);

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log('\n' + limit + ' Most Recent Tweets from @' + params.screen_name + ': ');
      console.log('----------------\n');

      for (i = 0; i < tweets.length; i++) {
        console.log((i + 1) + ': ');
        console.log(tweets[i].text);
        console.log(tweets[i].created_at);
        console.log('\n----------------\n');
      }

    }
  });

}


// SPOTIFY 

function spotifyIt() {

  var spotify = new Spotify(appKeys.spotifyKeys);

  spotify
  .search({ type: 'track', query: media, limit: limit })
  .then(function(response) {

    var albums = response.tracks.items;
      // console.log(albums);

    if (albums.length != 0) {

      if (limit === 20) { 

        console.log('\nTop spotify listings (by album) for the song "' + media + '" (' + limit + ' max):');
        console.log('----------------\n')

      } else {

        console.log('\nThere were no song listings for "' + process.argv[3] + '," so you get one Ace of Base song:');
        console.log('----------------\n')

      }

      for (i = 0; i < albums.length; i++) {
        console.log((i + 1) + ': ');

        console.log(response.tracks.items[i].album.artists[0].name);
        console.log(response.tracks.items[i].name);
        console.log(response.tracks.items[i].album.external_urls.spotify);
        console.log(response.tracks.items[i].album.name);
        console.log('\n----------------\n');

      }

    } else {
      media = 'The Sign Ace of Base';
      limit = 1;
      spotifyIt();
    }

  })
  .catch(function(err) {
    console.log(err);
  });

}


// OMBD 

function movieIt() {

  if (media) {

    var requestURL = 'http://www.omdbapi.com/?t=' + media + '&apikey=40e9cece';

    request(requestURL, function(error, response, body) {

      if (!error && response.statusCode === 200) {

        body = JSON.parse(body);
        console.log('\n');
        console.log(body.Title);
        console.log(body.Year);
        console.log(body.Ratings[0].Source + ' rating: ' + body.Ratings[0].Value);
        console.log(body.Ratings[1].Source + ' rating: ' + body.Ratings[1].Value);
        console.log('Country: ' + body.Country);
        console.log('Language: ' + body.Language);
        console.log('Plot: ' + body.Plot);
        console.log('Actors: ' + body.Actors);
        console.log('\n');

      }
    });

  } else {

    media = 'Mr. Nobody';
    movieIt();

  }
}


// DO WHATEVER TEXT FILE SAYS

function doIt() {

  fs.readFile('random.txt', 'utf8', function(error, data) {

    if (error) {
      return console.log(error);
    }

    // console.log(data);

    var dataArr = data.split(',');

    console.log(dataArr);

    command = dataArr[0];

    media = dataArr[1];

    switchIt();
    
  });

}
