// ==========================================
// TRINETRA BACKEND - FILE 56: utils/fileUploader.js
// Blueprint: Point 4 & 5 (Universal Original Media Download & In-Built Player)
// 🚨 DEEP SEARCH UPDATE: CLOUDFRONT CDN, EXACT METADATA & STREAMING FIX 🚨
// ==========================================
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import path from 'path'; // असली फाइल एक्सटेंशन निकालने के लिए

// S3 Config (Real AWS WAF & CloudWatch connected infra)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// Main Upload Function (Point 4 & 5)
export const uploadToTriNetraCloud = async (file, mediaType) => {
  // mediaType validation: Text, Photo, Video, Audio, Mic, PDF, Camera
  try {
    // 1. 🚨 Original File Context Guard (Asli naam aur extension)
    const originalName = file.originalname || `TriNetra_Media_${uuidv4()}`;
    const extension = path.extname(originalName) || `.${file.mimetype.split('/')[1]}`;
    const secureFileName = `TriNetra_${uuidv4()}${extension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${mediaType}/${secureFileName}`, // Folder structuring for extreme scaling
      Body: file.buffer,
      ContentType: file.mimetype,
      
      // 🚨 FIX for Point 4 (In-Built Player):
      // 'inline' allow karta hai ki video/pdf app ke andar smoothly chale.
      // Jab user "Download" button dabayega, tab frontend real file fetch karega.
      ContentDisposition: 'inline' 
    };

    const data = await s3.upload(params).promise();
    
    // 2. 🚨 CLOUDFRONT CDN SUPPORT (For Facebook Level Speed & No Buffering)
    const cloudFrontUrl = process.env.AWS_CLOUDFRONT_DOMAIN 
        ? `${process.env.AWS_CLOUDFRONT_DOMAIN}/uploads/${mediaType}/${secureFileName}` 
        : data.Location;

    // 3. 🚨 RETURN FULL METADATA FOR DB SYNC (Post.js & Chat.js needs this)
    return {
      success: true,
      url: cloudFrontUrl, // Fast streaming link for In-Built Player
      downloadLink: cloudFrontUrl, // Universal Download Link
      type: mediaType,
      
      // Asli data jo Mongoose DB me save hoga Point 4 & 5 ke liye
      originalFileName: originalName,
      mediaSize: file.size || file.buffer.length, // In Bytes
      mimeType: file.mimetype
    };
  } catch (error) {
    console.error("[TriNetra S3 Crash] AWS S3 Upload Error:", error);
    throw new Error("TriNetra Firewall: Failed to upload original media to AWS Cloud.");
  }
};
