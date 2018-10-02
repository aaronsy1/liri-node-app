// ENVIRONMENT
// =====================================
require("dotenv").config();

//REQUIRES
// =====================================

const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const keys = require("./keys");
const request = require("request");
const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
// =====================================

// Initialize the spotify API client using our client id and secret
var spotify = new Spotify(keys.spotify);

// =====================================

//initial prompt for user to choose what they want to search

const initialPrompt = function () {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to search through ...",
            choices: [
            "OMDB",
            "Spotify",
            "Twitter"
        ],
            name: "choice"
        }
    ])

        .then(function (resp) {
            
// Run function depending on user choice

            if (resp.choice === "OMDB") {
               searchMovie();
            }
            else if (resp.choice === "Spotify"){
                searchSong();
            }
            else if (resp.choice === "Twitter"){
                searchUser();
            }
        });

};

// =====================================

//ask user what to input for movie search
var searchMovie = function(){
        inquirer.prompt([
            {
                type: "input",
                message: "What movie would you like to search for?",
                name: "movie",
                
            }
        ])
.then (function(resp){
    var movieName = resp.movie;
    getMovie(movieName);
});
}

//Function to search movies

var getMovie = function(movieName){
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy")
    .then(function(resp){
            console.log("title: " +resp.data.Title);
            console.log("Year: " +resp.data.Year);
            console.log("Rated: " +resp.data.Rated);
            console.log("Released: " +resp.data.Released);
            console.log("Runtime: " +resp.data.Runtime);
            console.log("Genre: " +resp.data.Genre);
            console.log("Directed: " +resp.data.Directed);
    })
    }

// =====================================

// Writes to the log.txt file
var getArtistNames = function(artist) {
    return artist.name;
  };
  
  
var searchSong = function(){
    inquirer.prompt([
        {
            type: "input",
            message: "What song would you like to search for?",
            name: "song",
            
        }
    ])
.then (function(resp){
var songName = resp.song;
getSong(songName);
});

}

var getSong = function(songName){
    spotify.search(
        {
          type: "track",
          query: songName
        },
        function(err, data) {
          if (err) {
            console.log("Error occurred: " + err);
            return;
          }
    
          var songs = data.tracks.items;
    
          for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log("artist(s): ", songs[i].artists.map(getArtistNames));
            console.log("song name: ", songs[i].name);
            console.log("preview song: ", songs[i].preview_url);
            console.log("album: ", songs[i].album.name);
            console.log("-----------------------------------");
          }
        }
      );
    };
    
// =====================================

var searchUser = function(){
    inquirer.prompt([
        {
            type: "input",
            message: "What user would you like to search for?",
            name: "user",
            
        }
    ])
.then (function(resp){
var userName = resp.user;
getTweets(userName);
});

};

var getTweets = function(userName) {
    var client = new Twitter(keys.twitter);
  
    var params = {
      screen_name: userName
    };
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          console.log(tweets[i].created_at);
          console.log("");
          console.log(tweets[i].text);
        }
      }
    });
  };
  



initialPrompt();