const dotenv = require('dotenv');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

dotenv.config();

const bucketName = "brainybits";
const region = "sa-east-1";
const accessKeyId = "AKIA4MTWNTFV7LZNMJP5";
const secretAccessKey = "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";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

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
