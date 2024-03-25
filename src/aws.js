const dotenv = require('dotenv');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME || "brainybits";
const region = process.env.AWS_BUCKET_REGION || "sa-east-1";
const accessKeyId = process.env.AWS_ACCESS_KEY || "AKIA4MTWNTFV7LZNMJP5";
const secretAccessKey = process.env.AWS_SECRET_KEY || "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";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

//upload a file to s3
const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  };

  return s3.upload(uploadParams).promise();
};

const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  };

  return s3.getObject(downloadParams).createReadStream();
};

module.exports = { uploadFile, getFileStream };
