import dotenv from 'dotenv';
dotenv.config();

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;

const BUNNY_STORAGE_URL = process.env.BUNNY_STORAGE_URL || 'https://storage.bunnycdn.com';

// Upload file buffer to BunnyCDN
export const uploadToBunny = async (fileBuffer, fileName, folder = '') => {
  const path = folder ? `${folder}/${fileName}` : fileName;
  const url = `${BUNNY_STORAGE_URL}/${BUNNY_STORAGE_ZONE}/${path}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/octet-stream'
    },
    body: fileBuffer
  });

  if (!response.ok) {
    throw new Error(`BunnyCDN upload failed: ${response.statusText}`);
  }

  // Return public CDN URL
  return `${BUNNY_CDN_URL}/${path}`;
};

// Delete file from BunnyCDN
export const deleteFromBunny = async (filePath) => {
  const url = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}/${filePath}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'AccessKey': BUNNY_API_KEY }
  });

  return response.ok;
};
