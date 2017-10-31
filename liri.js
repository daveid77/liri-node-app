var appKeys = require('./keys.js');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var media = process.argv[3];
var whatToWrite = ''; 

var limit = 20; // Same limit used for Twitter and Spotify


// Placing switch within function allows it to be called after load for "do it"
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

      whatToWrite = '\n' + limit + ' Most Recent Tweets from @' + params.screen_name + ': \n';

      for (i = 0; i < tweets.length; i++) {

        whatToWrite += '----------------\n';
        whatToWrite += '\n' + (i + 1) + ': \n';
        whatToWrite += tweets[i].text + '\n';
        whatToWrite += tweets[i].created_at + '\n\n';

      }

    }

    console.log(whatToWrite);
    writeIt(whatToWrite);

  });

}


// SPOTIFY 

function spotifyIt() {

  var spotify = new Spotify(appKeys.spotifyKeys);

  spotify
  .search({ type: 'track', query: media, limit: limit })
  .then(function(response) {

    var albums = response.tracks.items;
    
    console.log(albums);

    if (albums.length != 0) {

      if (limit === 20) { 

        whatToWrite = '\nTop spotify listings (by album) for the song "' + media + '" (' + limit + ' max):';

      } else {

        whatToWrite = '\nThere were no song listings for "' + process.argv[3] + '," so you get one Ace of Base song:';

      }

      for (i = 0; i < albums.length; i++) {

        whatToWrite += '\n----------------\n\n';
        whatToWrite += (i + 1) + ': \n';
        whatToWrite += response.tracks.items[i].album.artists[0].name + '\n';
        whatToWrite += response.tracks.items[i].name + '\n';
        whatToWrite += response.tracks.items[i].album.external_urls.spotify + '\n';
        whatToWrite += response.tracks.items[i].album.name + '\n';

      }

      console.log(whatToWrite);
      writeIt(whatToWrite);

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
        whatToWrite = '\n';
        whatToWrite += body.Title + '\n';
        whatToWrite += body.Year + '\n';
        whatToWrite += body.Ratings[0].Source + ' rating: ' + body.Ratings[0].Value + '\n';
        whatToWrite += body.Ratings[1].Source + ' rating: ' + body.Ratings[1].Value + '\n';
        whatToWrite += 'Country: ' + body.Country + '\n';
        whatToWrite += 'Language: ' + body.Language + '\n';
        whatToWrite += 'Plot: ' + body.Plot + '\n';
        whatToWrite += 'Actors: ' + body.Actors + '\n';

      }

      console.log(whatToWrite);
      writeIt(whatToWrite);

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

    // console.log(dataArr);

    command = dataArr[0];

    media = dataArr[1];

    switchIt();

  });

}


// WRITE COMMANDS AND OUTPUT DATA TO TEXT FILE

function writeIt(newText) {

  if (!media) {media = ''};

  var newText = 'COMMAND: ' + command + ' ' + media + '\n' + newText
     + '\n==============================\n\n';

  fs.appendFile('log.txt', newText, function(err) {

    if (err) {
      return console.log(err);
    }

    // console.log('log.txt was updated\n');

  });

}

