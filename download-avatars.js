var request = require('request');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var results = JSON.parse(body);
    cb(err, results);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  for (var contributor of result){
      console.log("Result:", contributor.avatar_url);
  }
});

  // var parsedJSON = JSON.parse(result);
  // var avatarURLs = parsedJSON



