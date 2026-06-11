// ==========================================
// TRINETRA FRONTEND - Shared AWS S3 Upload Utility
// Direct upload to AWS S3 with CDN URL retrieval
// ==========================================
import { uploadData, getUrl } from 'aws-amplify/storage';

/**
 * Upload a file to AWS S3 and return the CDN URL.
 *
 * @param {File} file - The file to upload
 * @param {string} folder - The S3 folder path (e.g., 'posts/userId', 'ai_inputs/userId')
 * @param {object} options - Upload options
 * @param {string} options.accessLevel - S3 access level ('guest' | 'authenticated') default: 'guest'
 * @param {string} options.pathPrefix - Path prefix ('public' | 'protected') default: 'public'
 * @returns {Promise<string>} The CDN URL of the uploaded file
 */
export const uploadToS3 = async (file, folder, options = {}) => {
  const { accessLevel = 'guest', pathPrefix = 'public' } = options;

  const fileExt = file.name.split('.').pop() || 'file';
  const fileName = `${folder}/${Date.now()}_trinetra.${fileExt}`;
  const fullPath = `${pathPrefix}/${fileName}`;

  await uploadData({
    path: fullPath,
    data: file,
    options: { contentType: file.type || 'application/octet-stream', accessLevel }
  }).result;

  const urlResult = await getUrl({ path: fullPath });
  return urlResult.url.toString();
};
