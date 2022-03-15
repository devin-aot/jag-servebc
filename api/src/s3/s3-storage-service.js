var aws4  = require('aws4');
var fs = require('fs');


// aws4 will sign an options object as you'd pass to http.request, with an AWS service and region
var opts = { host: 'ag-pssg-sharedservices.objectstore.gov.bc.ca', path: '/ag-pssg-jsb-srvdoc-dev-bkt', service: 'execute-api', region: 'us-west-1' }
 
// aws4.sign() will sign and modify these options, ready to pass to http.request
aws4.sign(opts, { accessKeyId: 'AKIA2CD6BD9A0C8EC26C', secretAccessKey: 'b/i6oHBTOy5OYui+85vvSo9J4jVJuMlor6rargAG' })

console.log(opts)




/* 
var ep = new AWS.Endpoint({
   host: 'ag-pssg-sharedservices.objectstore.gov.bc.ca',
   port: 443,
   protocol: 'https'

});



const s3 = new AWS.S3({
    //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    accessKeyId: 'AKIA2CD6BD9A0C8EC26C',
    secretAccessKey: 'b/i6oHBTOy5OYui+85vvSo9J4jVJuMlor6rargAG',
    AWS_S3_ENDPOINT:'https://ag-pssg-sharedservices.objectstore.gov.bc.ca',
    endpoint: ep
     
  })

   s3.listBuckets( (err, data) => {
    if (err) {
      console.log(err)
    }
    //resolve(data.Location)
    console.log(err)
  })


const filename = 'portal-main-page.pdf'
const fileContent = fs.readFileSync(filename)

const params = {
  // Bucket: process.env.AWS_BUCKET_NAME,
  Bucket: 'ag-pssg-jsb-srvdoc-dev-bkt',
  Key: `${filename}.pdf`,
  Body: fileContent
}

s3.upload(params, (err, data) => {
  if (err) {
    console.log(err)
  }
  //resolve(data.Location)
  console.log(err)
}) */