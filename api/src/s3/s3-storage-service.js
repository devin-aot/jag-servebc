var aws4  = require('aws4');
//var fs = require('fs');


// Get Enviroment variables
var BUCKETNAME = process.env.S3_BUCKETNAME;
var ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
var SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
var HOST = process.env.S3_HOST;
var REGION = process.env.S3_REGION;
var SERVICE = process.env.S3_SERVICE;

function getAuthorizationKey() {

  // aws4 will sign an options object as you'd pass to http.request, with an AWS service and region
  var opts = { host: HOST, path: BUCKETNAME, service: SERVICE, region: REGION }
   
  // aws4.sign() will sign and modify these options, ready to pass to http.request
  aws4.sign(opts, { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY })
  
  console.log(opts)
  return opts;
}



