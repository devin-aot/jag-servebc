const aws4  = require('aws4');
//const fs = require('fs');


// Get Enviroment constiables
const BUCKETNAME = process.env.S3_BUCKETNAME;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const HOST = process.env.S3_HOST;
const REGION = process.env.S3_REGION;
const SERVICE = process.env.S3_SERVICE;

function getAuthorizationKey() {

  // aws4 will sign an options object as you'd pass to http.request, with an AWS service and region
  let opts = { host: HOST, path: BUCKETNAME, service: SERVICE, region: REGION }
   
  // aws4.sign() will sign and modify these options, ready to pass to http.request
  aws4.sign(opts, { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY })
  
  console.log(opts)
  return opts;
}
getAuthorizationKey()