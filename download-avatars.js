var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');
var fileType = require('file-type');
var dotenv = require('dotenv').config();

var input = process.argv.slice(2);
var repoOwner = input[0];
var repoName = input[1];

//Make sure two fields have been entered. Call function if true.
if (repoOwner === undefined || repoName === undefined) {
  throw new Error("Please enter the repo owner and then the repo name.");
}

getRepoContributors(repoOwner, repoName, function(err, result) {

  console.log('Starting Downloads...');

  for (var contributor of result){
  //Iterate through the JSON object

    downloadImageByURL(contributor.avatar_url, contributor.login);
    //Download images from their URL to a designated file path.
    //Name the files after the user's login name.
  }
});


function getRepoContributors(repoOwner, repoName, cb) {

  let options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': dotenv.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {

    if(res.statusCode !== 200){
      throw new Error("Cannot access Github repo. Check that you entered the correct repo and owner.");
    }
    //Check to make sure the data is accessed.
    //Throw an error if it is not accessable.

    let results = JSON.parse(body);
    //Parse body into JSON
    cb(err, results);
  });
}


function downloadImageByURL(url, userLogin) {

  let filePath = './avatars/';
  //file path to download images

  if (!fs.existsSync(filePath)){
    fs.mkdirSync(filePath);
  }
  //Check to see if folder exist. If not, create it.

  let fileName = filePath + userLogin;

  var requestSettings = {
    method: 'GET',
    url: url,
    encoding: null
  };
  //Create request setting object

  request(requestSettings, function(error, response, body){
    var fileInfo = fileType(body);
    //Object with file extension as first key
    var fullFileName = fileName + "." + fileInfo.ext;
    //create file name with extension (ex .jpg)
    fs.writeFile(fullFileName, body, function(err){return err;});
    //write the file to local file.
    console.log("Download Complete");
  });
}
