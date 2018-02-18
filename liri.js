var fs = require("fs");
// fs.readFile("", "", )
require("dotenv").config();
// fs.readFile(".env", "utf8", function())
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require("node-spotify-api");
var omdb = require('omdb');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var inquirer = require("inquirer");
var request = require("request");
var logFile = "log.txt";
var logCommand;
var logResponse;
var logData;
// var command = process.arg[3];

// prompt the user with Inquirer
inquirer.prompt([{
    type: "list",
    name: "command",
    message: "What do you want to do?",
    choices: ['View My Last 10 Tweets', 'Spotify a Song', 'Look up a Movie', 'do-what-it-says']
  }])
  // Store the choice in a variable called userChoice
  .then(function (userChoice) {
    // .then(function (userChoice) {
    // This is where liri does one of 4 things
    // if user chooses View My Last 10 Tweets...
    // if (userChoice.command === 'View My Last 10 Tweets') {
    runCommand(userChoice.command);
    // We will then create a switch-case statement (if-then would also work).
    // The switch-case will direct which function gets run.
  });

function runCommand(action) {
  switch (action) {
    case "View My Last 10 Tweets":
      getTweets();
      break;
    case "Spotify a Song":
      spotifyThis();
      break;
    case "Look up a Movie":
      movieSearch();
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("Please choose View My Last 10 Tweets, Spotify a Song, Look up a Movie, or do-what-it-says")
  }
}

function log2Text() {
  fs.appendFile(logFile, logData, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Command Logged!")
    }
  })
};

function getTweets() {
  // twitter parameters
  var parameters = {
    screen_name: 'WolfofWaltonWay',
    count: 10
  };
  // Get request for my last 10 tweets
  client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
    if (error) {
      console.log('An unexpected error occurred' + JSON.stringify(error));
    } else {
      console.log("These are my last 10 tweets");
      for (var t = 0; t < tweets.length; t++) {
        var logData = (tweets[t].text);
        console.log('--------------------------');
        console.log('@WolfOfWaltonWay: ' + logData);
        // console.log('--------------------------');
        log2Text(logData);
      };
      // log2Text(logData);

    };
  });
}
// // if user chooses 'Spotify a Song' inquire about what song 
// else if (userChoice.command === 'Spotify a Song') 

function spotifyThis() {
  inquirer.prompt([{
    type: "input",
    name: "spotifySong",
    message: "What song would you like to Spotify?"
    // Store the user input 'spotifySong' in a variable called spotifyThisSong
  }]).then(function (ans) {
    // Spotify code goes here
    spotify.search({
      type: 'track',
      query: ans.spotifySong
    }, function (err, data) {
      if (err) {return console.log('Spotify Error occurred: ' + JSON.stringify(err));}
      console.log("Artist: ", data.tracks.items[0].artists[0].name);
      console.log("Song Name: ", data.tracks.items[0].name);
      console.log("Link: ", data.tracks.items[0].preview_url);
      console.log("Album: ", data.tracks.items[0].album.name);
    });
  })
}

// // if user chooses `Look up a Movie` inquire about what movie
function movieSearch() {
  inquirer.prompt([{
    type: "input",
    name: "omdbThis",
    message: "What movie would you like to OMDB?"
    // Store the user input "omdbMovie" in a variable called omdbThisMovie
  }]).then(function (omdbThisMovie) {
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + omdbThisMovie.omdbThis + "&y=&plot=short&apikey=trilogy";
    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);
    request(queryUrl, function (error, response, body) {
      // If the request is successful
      if (!error && response.statusCode === 200) {
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Release Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("RT Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Production Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Awards: " + JSON.parse(body).Awards);
        console.log("Plot: " + JSON.parse(body).Plot);
      }
    });
  })
}

// if user chooses 'do-what-it-says' inquire about what to do using the fs node package and the contents of random.txt
function doWhatItSays() {
  console.log("Do what it says");
  // The code will store the contents of the reading inside the variable "data"
  fs.readFile("random.txt", "utf8", function (error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    runCommand(dataArr[0]);

  });
};
