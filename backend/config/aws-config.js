// const AWS = require("aws-sdk");

// AWS.config.update({region: "us-east-1"});

// const s3 = new AWS.S3();
// const S3_BUCKET = "cortexais3bucket";

// module.exports = {s3,S3_BUCKET};

const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const S3_BUCKET = "cortexais3bucket";

module.exports = { s3, S3_BUCKET };
