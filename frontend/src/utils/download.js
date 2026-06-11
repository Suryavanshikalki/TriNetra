// ==========================================
// TRINETRA FRONTEND - Universal Download Utility
// Shared blob-based force-download for all media types
// ==========================================

/**
 * Force-download a file from a URL using the Blob API.
 * Falls back to opening in a new tab if CORS blocks the fetch.
 *
 * @param {string} url - The media URL to download
 * @param {string} type - Media type hint ('image', 'video', 'audio', 'pdf', etc.)
 * @param {string} prefix - Filename prefix (default: 'TriNetra_Media')
 * @returns {Promise<void>}
 */
export const downloadMedia = async (url, type = 'file', prefix = 'TriNetra_Media') => {
  if (!url) return;

  const extMap = {
    image: 'jpg',
    video: 'mp4',
    audio: 'mp3',
    pdf: 'pdf',
  };
  const ext = extMap[type] || 'file';

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${prefix}_${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Direct download failed, using fallback:', err);
    window.open(url, '_blank');
  }
};
