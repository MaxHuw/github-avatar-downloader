var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');

var input = process.argv.slice(2);
var repoOwner = input[0];
var repoName = input[1];

//Make sure two fields have been entered. Call function if true.
if (repoOwner === undefined || repoName === undefined) {
  throw new Error("Please enter the repo owner and then the repo name.");
}

console.log('Starting downloads...');

getRepoContributors(repoOwner, repoName, function(err, result) {

  for (var contributor of result){
  //Iterate through the JSON object

    var filePath = './avatars/';
    //file path to download images

    downloadImageByURL(contributor.avatar_url, filePath + contributor.login);
    //Download images from their URL to a designated file path.
    //Name the files after the user's login name.
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

    if(res.statusCode !== 200){
      throw new Error("Cannot access Github repo. Check that you entered the correct repo and owner.");
    }
    //Check to make sure the data is accessed.
    //Throw an error if it is not accessable.

    var results = JSON.parse(body);
    //Parse body into JSON
    cb(err, results);
  });
}


function downloadImageByURL(url, filePath) {

  request.get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response){

      response.on('end', function(){
        console.log("Download Complete!");
        //Notify user when an image has been downloaded.
      });

    })
    .pipe(fs.createWriteStream(filePath));
    //Downloads image to set directory
};
