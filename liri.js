// using .env to hide keys
require("dotenv").config();

// values
var keys = require("./key.js");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require("axios")
var spotify = new Spotify(keys.spotify);
var request = require("request");
var nameS = process.argv[3];
var lirireturn = process.argv[2];
var divider = "\n------------------------------------------------------------\n\n";

// switches for various commands
switch (lirireturn) {
    case "concert-this":
        var artistName = process.argv.slice(3).join(" ");
        concertThis(artistName);
        break;

    case "spotify-this-song":
        var songName = process.argv.slice(3).join(" ");
        spotifyThisSong(songName);
        break;

    case "movie-this":
        var movieName = process.argv.slice(3).join(" ");
        movieThis(movieName);
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

        // instructions for first timers

    default:
        console.log("\n" + "type any command after 'node liri.js':" + "\n" +
            "concert-this" + "\n" +
            "spotify-this-song" + "\n" +
            "movie-this" + "\n" +
            "do-what-it-says" + "\n" +
            "use quotes for multiword titles!");
}
// 1st command concert-this
function concertThis(artistName) {

    var URL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    axios.get(URL)

    .then(function(response) {

            for (var i = 0; i < response.data.length; i++) {

                var eventdate = response.data[i].datetime;
                var eventDate = eventdate.split(",");

                var concertResults =
                    "Venue Name: " + response.data[i].venue.name + "\n" +
                    "Venue Location: " + response.data[i].venue.city + "\n" +
                    "Event date: " + eventDate + "\n"

                console.log(concertResults);
                fs.appendFileSync("log.txt", concertResults + divider)
            }

        })
        .catch(function(error) {
            console.log(error);
        });
}


// 2nd command spotify-this-song
// artist, song name, preview, album
function spotifyThisSong(songName) {


    if (!songName) {
        songName = "The Sign";
    };
    songRequest = songName;
    spotify.search({
            type: "track",
            query: songRequest
        },
        function(err, data) {
            if (!err) {
                var songInfo = data.tracks.items;
                for (var i = 0; i < 5; i++) {
                    if (songInfo[i] != undefined) {
                        var spotifyResults =
                            "Artist:" + songInfo[i].artists[0].name + "\n" +
                            "song:" + songInfo[i].name + "\n" +
                            "Preview URL:" + songInfo[i].preview_url + "\n" +
                            "Album:" + songInfo[i].album.name + "\n"

                        console.log(spotifyResults);
                        fs.appendFileSync("log.txt", spotifyResults + divider)
                    };
                };
            } else {
                console.log("error:" + err);
                return;
            };
        }
    )
};

// 3rd command movie-this

function movieThis(movieName) {
    if (!movieName) {
        movieName = "Mr.nobody";
    };
    movieRequest = movieName;
    axios.get("http://www.omdbapi.com/?t=" + movieRequest + "&y=&plot=short&apikey=trilogy")
        .then(
            function(response) {
                var result = response.data;
                var movieInfo =
                    "\nTitle : " + result.Title + "\n" +
                    "Release Year : " + result.Released + "\n" +
                    "IMDB Rating : " + result.imdbRating + "\n" +
                    "Rotten Tomatoes Rating : " + result.Ratings[1].Value + "\n" +
                    "Country : " + result.Country + "\n" +
                    "Language : " + result.Language + "\n" +
                    "Plot : " + result.Plot + "\n" +
                    "Actors : " + result.Actors + "\n"

                console.log(movieInfo);
                fs.appendFileSync("log.txt", movieInfo + divider)

            }).catch(function(error) {
            if (error) {
                console.log(error);
            }
        })
}

// 4th command do-what-it-says

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err);
        }
        var readData = data.split(",");
        if (readData[0] === "spotify-this-song") {
            spotifyThisSong(readData[1]);
        } else if (readData[0] === "movie-this") {
            movieThis(readData[1]);
        }
    })
}