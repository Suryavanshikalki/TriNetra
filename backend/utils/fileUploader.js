// ==========================================
// TRINETRA BACKEND - FILE 56: utils/fileUploader.js
// Blueprint: Point 4 & 5 (Universal Original Media Download)
// ==========================================
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// S3 Config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// Main Upload Function
export const uploadToTriNetraCloud = async (file, mediaType) => {
  // mediaType validation: Text, Photo, Video, Audio, Mic, PDF, Camera
  try {
    const extension = file.mimetype.split('/')[1];
    const originalFileName = `TriNetra_Original_${uuidv4()}.${extension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: originalFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      // "attachment" forces the browser/app to download original format directly
      ContentDisposition: 'attachment' 
    };

    const data = await s3.upload(params).promise();
    
    return {
      success: true,
      url: data.Location, // To view in In-Built Player
      downloadLink: data.Location, // For Universal Download Button
      type: mediaType
    };
  } catch (error) {
    console.error("AWS S3 Upload Error:", error);
    throw new Error("Failed to upload original media.");
  }
};
