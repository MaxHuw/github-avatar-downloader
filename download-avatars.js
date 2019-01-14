var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader');

var input = process.argv.slice(2);
var repoOwner = input[0];
var repoName = input[1];

getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  for (var contributor of result){ //Iterate through the JSON object
      var filePath = './avatars/'; //file path to download images

      //download images from their URL to a designated file path.
      //Name the files after the user's login name.
      downloadImageByURL(contributor.avatar_url, filePath + contributor.login);
  }
});

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var results = JSON.parse(body); //Parse body into readable JSON
    cb(err, results);
  });
}


function downloadImageByURL(url, filePath) {

  request.get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response){
      console.log('Response Status Code: ', response.statusCode);

    response.on('end', function(){
      console.log("Download Complete!");
     });

    })
    .pipe(fs.createWriteStream(filePath));
};
