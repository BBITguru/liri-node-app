var fs = require("fs");
// fs.readFile("", "", )
require("dotenv").config();
//var fs = require("fs");
// fs.readFile(".env", "utf8", function())
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var omdb = require('omdb');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var inquirer = require("inquirer");
// var command = process.argv[2];
// var command = process.arg[3];

// liri.js prompts the user with Inquier
inquirer.prompt([{
    type: "list",
    name: "command",
    message: "What do you want to do?",
    choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says']
  }])
  // Store the choice in a variable called userChoice
  .then(function (userChoice) {
      // This is where liri does one of 4 things
      // if user chooses my-tweets...
      if (userChoice.command === 'my-tweets') {
        // twitter parameters
        var parameters = {
          screen_name: 'TheWolfofWaltonWay',
          count: 10
        };
        // Get request for my last 10 tweets
        client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
          if (!error) {
            console.log('An unexpected error occurred' + error);
          } else {
            console.log("These are my last 10 tweets");
            for (var t = 0; t < tweets.length; t++) {
              console.log('--------------------------');
              console.log(tweets[i].text);
              console.log('--------------------------');
            };
          };
        });
      }
      // if user chooses 'spotify-this-song' inquire about what song 
      else if (userChoice.command === 'spotify-this-song') {
        inquirer.prompt([{
          type: "input",
          name: "spotifySong",
          message: "What song would you like to Spotify?"
          // Store the user input 'spotifySong' in a variable called spotifyThisSong
        }]).then(function (spotifyThisSong) {
          // Spotify code goes here
          spotify.search({
            type: 'track',
            query: spotifyThisSong
          }, function (err, data) {
            if (err) {
              return console.log('Spotify Error occurred: ' + err);
            }
            console.log(data);
          });
        })
      }
      // if user chooses `movie-this` inquire about what movie
      else if (userChoice.command === 'movie-this') {
        inquirer.prompt([{
          type: "input",
          name: "omdbMovie",
          message: "What movie would you like to OMDB?"
          // Store the user input "omdbMovie" in a variable called omdbThisMovie
        }]).then(function (omdbThisMovie) {
          // OMDB code goes here
          omdb.search(omdbThisMovie, function (err, movies) {
            if (err) {
              return console.log(err);
            }
            if (movies.length < 1) {
              return console.log('No movies were found!');
            }
            movies.forEach(function (movie) {
              console.log('%s (%d)', movie.title, movie.year);
            });
          });
          omdb.get({
            title: omdbThisMovie,
            // year:
          }, true, function (err, movie) {
            if (err) {
              return console.log(err);
            }
            if (!movie) {
              return console.log('Movie not found!');
            }
            //  * Title of the movie.
            //  * Year the movie came out.
            //  * IMDB Rating of the movie.
            //  * Rotten Tomatoes Rating of the movie.
                //   tomato: !movie.tomatoMeter ? undefined : {
                //     meter: +movie.tomatoMeter,
                //     image: movie.tomatoImage,
                //     rating: +movie.tomatoRating,
                //     reviews: +movie.tomatoReviews,
                //     fresh: +movie.tomatoFresh,
                //     rotten: +movie.tomatoRotten,
                //     consensus: movie.tomatoConsensus,
                //     userMeter: +movie.tomatoUserMeter,
                //     userRating: +movie.tomatoUserRating,
                //     userReviews: +movie.tomatoUserReviews,
                //     url: movie.tomatoURL,
                //     dvdReleased: movie.DVD ? new Date(movie.DVD) : null
                // },
            //  * Country where the movie was produced.
                //
            //  * Language of the movie.
            //  * Plot of the movie.
            //  * Actors in the movie.
            console.log('%s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
            console.log(movie.plot);
          });
        })
      }
      // if user chooses 'do-what-it-says' inquire about what to do using the fs node package and the contents of random.txt
      else ( function doWhatItSays (){
         console.log("Do what is says");
      })
    );
  };





// function spotifyThisSong();
// function omdbThisMovie;
// function doWhatItSays() {

// };

// var request = require('request');
// request('http://www.google.com', function (error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });