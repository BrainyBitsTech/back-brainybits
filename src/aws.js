const dotenv = require('dotenv');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const mime = require('mime-types');

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

const bucketName = "brainybits";
const region = "sa-east-1";
const accessKeyId = "AKIA4MTWNTFV7LZNMJP5";
const secretAccessKey = "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";

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  try {
    const result = await s3.upload(uploadParams).promise();
    return result
  } catch (error) {
    console.log('error => ', error)
  }

  const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${result.Key}`;
  return objectUrl;
};

const getFileStream = async (key) => {
  const params = {
    Bucket: bucketName,
    Key: key
  }
  const command = new GetObjectCommand(params);
  const seconds = 10000
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  
  return url
};

module.exports = { uploadFile, getFileStream };
