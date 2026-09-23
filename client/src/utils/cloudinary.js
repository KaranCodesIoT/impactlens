const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Build a Cloudinary transformation URL.
 */
export function cloudinaryUrl(publicId, transforms = [], resourceType = 'image') {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}`;
  const transformStr = transforms.length
    ? transforms.map(t => Object.entries(t).map(([k, v]) => `${k}_${v}`).join(',')).join('/')
    : '';

  return transformStr
    ? `${base}/${resourceType}/upload/${transformStr}/${publicId}`
    : `${base}/${resourceType}/upload/${publicId}`;
}

/**
 * Get a thumbnail URL for gallery display.
 */
export function getThumbnailUrl(publicId, resourceType = 'image') {
  if (resourceType === 'video') {
    return cloudinaryUrl(publicId + '.webp', [
      { w: 400, h: 300, c: 'fill', g: 'auto' },
      { q: 'auto' }
    ], 'video');
  }
  return cloudinaryUrl(publicId, [
    { w: 400, h: 300, c: 'fill', g: 'auto' },
    { q: 'auto', f: 'webp' }
  ]);
}

/**
 * Get a medium-sized URL for detail view.
 */
export function getDetailUrl(publicId, resourceType = 'image') {
  return cloudinaryUrl(publicId, [
    { w: 1200, c: 'limit' },
    { q: 'auto', f: 'auto' }
  ]);
}

/**
 * Get URLs for before/after comparison (consistent sizing).
 */
export function getComparisonUrl(publicId) {
  return cloudinaryUrl(publicId, [
    { w: 800, h: 600, c: 'fill', g: 'auto' },
    { q: 'auto', f: 'webp' }
  ]);
}

/**
 * Open the Cloudinary Upload Widget.
 * Returns a promise that resolves with the upload results.
 */
export function openUploadWidget(projectId, projectSlug) {
  return new Promise((resolve, reject) => {
    if (!window.cloudinary) {
      reject(new Error('Cloudinary widget not loaded'));
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: `impactlens/${projectSlug}`,
        tags: [projectId],
        context: `project_id=${projectId}`,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 20,
        maxFileSize: 50000000, // 50MB
        resourceType: 'auto',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm'],
        showPoweredBy: false,
        styles: {
          palette: {
            window: '#0f172a',
            sourceBg: '#1e293b',
            windowBorder: '#334155',
            tabIcon: '#6366f1',
            inactiveTabIcon: '#64748b',
            menuIcons: '#6366f1',
            link: '#818cf8',
            action: '#6366f1',
            inProgress: '#6366f1',
            complete: '#22c55e',
            error: '#ef4444',
            textDark: '#0f172a',
            textLight: '#f1f5f9'
          }
        }
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (result.event === 'success') {
          resolve(result.info);
        }
      }
    );

    widget.open();
  });
}

export { CLOUD_NAME, UPLOAD_PRESET };
