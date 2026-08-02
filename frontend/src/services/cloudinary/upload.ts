import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants/cloudinary';

/**
 * Uploads straight from the browser to Cloudinary using an unsigned upload
 * preset - deliberately not going through apiClient (that's configured for
 * our own backend, with a JWT interceptor that has no business on a
 * third-party request) and deliberately not the Cloudinary SDK (a plain
 * fetch does the whole job in a few lines).
 *
 * Unsigned means no API secret is involved anywhere in this file - the
 * preset itself (created as "Unsigned" in the Cloudinary dashboard) is what
 * authorizes the upload, scoped to whatever that preset allows.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  );

  if (!response.ok) {
    throw new Error('تعذر رفع الصورة، حاول مرة أخرى.');
  }

  const data = (await response.json()) as { secure_url: string };
  return data.secure_url;
}
