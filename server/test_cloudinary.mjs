// Test if cloudinary config is available
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);

import cloudinary from './config/cloudinary.js';
import { getAnalysisUrl } from './services/cloudinary.js';

console.log('Cloudinary config:', cloudinary.config());

try {
  const url = getAnalysisUrl('samples/landscapes/nature-mountains', 'image');
  console.log('Analysis URL:', url);
  console.log('✅ Cloudinary URL generation WORKS');
} catch (err) {
  console.error('❌ Cloudinary URL FAILED:', err.message);
}
