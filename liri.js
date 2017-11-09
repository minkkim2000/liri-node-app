var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;
var spotifyKeys = keys.spotifyKeys;

var userInput = process.argv;
var searchTitle = userInput[3];

// GETTING MULTI-WORD SEARCH TITLE
for (var i = 3; i < userInput.length; i++) {
	if (i > 3 && i < userInput.length) {
    searchTitle =  searchTitle + " " + userInput[i];
  }
}



// =========================
// TWITTER PART
var Twitter = require('twitter');
var client = new Twitter(twitterKeys);

function getSomeTwitter (){ 
	var params = {screen_name: ''};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    for (var i = 0; i < tweets.length; i++) {
	      console.log("=============================================================");
	      console.log(i+1);
	      console.log("tweeted at: " + tweets[i].created_at);
	      console.log(tweets[i].text);
	    }
	      console.log("=============================================================");
	  }
	});
};



// =========================
// // SPOTIFY PART
var Spotify = require('node-spotify-api');
var spotify = new Spotify(spotifyKeys);

function spotifySomeSong() {
	
	if (searchTitle === undefined) {
		searchTitle = "a sign";
	}

    console.log("Song to search: " + searchTitle);

    // SPOTIFY SEARCH FUNCTION
    spotify.search({ type: 'track', query: searchTitle }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songData = data.tracks.items

        for (var i = 0; i < songData.length; i++) {
            console.log("-♬-------♪--♫-----♫----♪---♬---♫---♪----♫-♬-----♪---------♩--");
            console.log(i + 1);
            console.log("Song title: " + songData[i].name);
            console.log("Artist: " + songData[i].artists[0].name);
            console.log("Album title: " + songData[i].album.name);
            console.log("Preview URL: " + songData[i].preview_url);
        }

        console.log("====================================================================");
    });
}



// =========================
// OMDB MOVIE SEARCH
var request = require("request");


function omdbMovieSearch() {
	if (searchTitle === undefined) {
		searchTitle = "Mr Nobody";
	}

    console.log("Movie to search: " + searchTitle);

    var queryUrl = "http://www.omdbapi.com/?t=" + searchTitle + "&y=&plot=short&apikey=40e9cece";

    console.log("queryURL: " + queryUrl);

    request(queryUrl, function(error, response, body) {
        console.log("====================================================================");
        if (!error && response.statusCode === 200) {

        	var movieData = JSON.parse(body);

            console.log("Movie Title: " + movieData.Title);
            console.log("Release Year: " + movieData.Year);
            console.log("Imdb Rating: " + movieData.imdbRating);

            // not all movies have rotton tomato ratings
            if (movieData.Ratings[1] !== undefined) {
            	console.log("Rotton Tomatos Rating: " + movieData.Ratings[1].Value);
            } 
            else {
            	console.log("Rotton Tomatos Rating: N/A");
            }

            console.log("Country Produced: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot Summary: " + movieData.Plot);
            console.log("Starring: " + movieData.Actors);
        }
        console.log("====================================================================");
    });
}


// =========================
// DO WHAT IT SAYS RANDOM.TXT PART

function doWhatItSays() {

    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        var doWhat = dataArr[0];
        var itSays = dataArr[1].replace(/[^a-zA-Z ]/g, "");

        console.log("Do What: " + doWhat);
        console.log("it says: " + itSays);

        userCommand = doWhat;
        searchTitle = itSays;
        runLiri();
    });
}


// RUN LIRI
var userCommand = userInput[2];

function runLiri () {
	if (userCommand === "my-tweets"){
		getSomeTwitter();
	} else if (userCommand === "spotify-this-song"){
		spotifySomeSong();
	} else if (userCommand === "movie-this"){
		omdbMovieSearch();
	} else if (userCommand === "do-what-it-says"){
		doWhatItSays();
	}
}

runLiri();