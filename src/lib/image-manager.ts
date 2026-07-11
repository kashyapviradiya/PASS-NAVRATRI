import { adminStorage } from './firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(fileBuffer: Buffer, mimeType: string, folder: string = 'events') {
  if (process.env.DEMO_MODE === 'true') {
    // Return a dummy image URL for demo mode if no real Firebase is configured
    return `https://source.unsplash.com/random/800x600/?garba,navratri,${folder}`;
  }

  const bucket = adminStorage.bucket();
  const filename = `${folder}/${uuidv4()}`;
  const file = bucket.file(filename);

  await file.save(fileBuffer, {
    metadata: { contentType: mimeType },
    public: true, // Make the file publicly accessible
  });

  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/${filename}`;
}
