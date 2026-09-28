import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    configured = true;
  }
}

// Proxy that auto-configures on first use
const lazyCloudinary = new Proxy(cloudinary, {
  get(target, prop) {
    ensureConfigured();
    return target[prop];
  }
});

export default lazyCloudinary;
