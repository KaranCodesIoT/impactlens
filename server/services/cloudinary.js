import cloudinary from '../config/cloudinary.js';

/**
 * Get an optimized URL for AI analysis input.
 * Resizes to max 1024px width, auto quality, JPEG format.
 */
export function getAnalysisUrl(publicId, resourceType = 'image') {
  if (resourceType === 'video') {
    // Extract 4 key frames from video
    return getVideoFrameUrls(publicId);
  }

  return cloudinary.url(publicId, {
    transformation: [
      { width: 1024, crop: 'limit' },
      { quality: 'auto', fetch_format: 'jpg' }
    ],
    secure: true
  });
}

/**
 * Get thumbnail URL for gallery grid display.
 */
export function getThumbnailUrl(publicId, resourceType = 'image') {
  const options = {
    transformation: [
      { width: 400, height: 300, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'webp' }
    ],
    secure: true
  };

  if (resourceType === 'video') {
    options.resource_type = 'video';
    // For video thumbnails, Cloudinary auto-generates from first frame
    return cloudinary.url(publicId + '.webp', options);
  }

  return cloudinary.url(publicId, options);
}

/**
 * Get consistent-size URLs for before/after comparison.
 */
export function getComparisonUrl(publicId) {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 800, height: 600, crop: 'fill', gravity: 'auto' },
      { quality: 'auto', fetch_format: 'webp' }
    ],
    secure: true
  });
}

/**
 * Get report-sized image URL.
 */
export function getReportUrl(publicId) {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 600, crop: 'limit' },
      { quality: 80, fetch_format: 'jpg' }
    ],
    secure: true
  });
}

/**
 * Extract key frames from video for AI analysis.
 * Returns array of frame URLs at 0%, 25%, 50%, 75% of the video.
 */
export function getVideoFrameUrls(publicId) {
  const positions = ['so_0', 'so_25p', 'so_50p', 'so_75p'];
  return positions.map(pos => {
    return cloudinary.url(publicId + '.jpg', {
      resource_type: 'video',
      transformation: [
        { start_offset: pos === 'so_0' ? '0' : pos.replace('so_', '').replace('p', '%') },
        { width: 1024, crop: 'limit' },
        { quality: 'auto' }
      ],
      secure: true
    });
  });
}

/**
 * Delete an asset from Cloudinary.
 */
export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (err) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, err.message);
    // Don't throw — we still want to delete from our DB
  }
}
