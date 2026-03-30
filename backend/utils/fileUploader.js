import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// AWS S3 Setup for Original Media Download
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

export const uploadToTriNetraCloud = async (file, mediaType) => {
  // mediaType can be: 'Photo', 'Video', 'Audio', 'Mic', 'PDF', 'Camera'
  const extension = file.mimetype.split('/')[1];
  const originalFileName = `TriNetra_Original_${uuidv4()}.${extension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: originalFileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: 'attachment' // Forces direct download for Universal Download Rule
  };

  const data = await s3.upload(params).promise();
  return {
    url: data.Location, // URL to view in In-built player
    downloadLink: data.Location, // Direct Original Download Link
    type: mediaType
  };
};
