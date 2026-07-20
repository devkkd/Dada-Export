import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Cloudflare R2 is S3-compatible — we use the AWS SDK pointed at R2's endpoint
const R2 = new S3Client({
  region: 'auto', // R2 uses 'auto'
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL; // e.g. https://pub-xxx.r2.dev  OR your custom domain

/**
 * Upload a file buffer to Cloudflare R2
 * @param {Buffer} buffer   - file contents
 * @param {string} key      - storage path, e.g. "categories/dresses.webp"
 * @param {string} mimeType - e.g. "image/webp"
 * @returns {string} public URL of the uploaded file
 */
export async function uploadToR2(buffer, key, mimeType) {
  const command = new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimeType,
    // make file publicly readable
    ACL:         'public-read',
  });

  await R2.send(command);

  // Return the public CDN URL
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete a file from Cloudflare R2 by its key
 * @param {string} key - storage path, e.g. "categories/dresses.webp"
 */
export async function deleteFromR2(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key:    key,
  });
  await R2.send(command);
}

/**
 * Extract the R2 key from a full public URL
 * e.g. "https://pub-xxx.r2.dev/categories/dresses.webp" → "categories/dresses.webp"
 */
export function getKeyFromUrl(url) {
  if (!url) return null;
  return url.replace(`${PUBLIC_URL}/`, '');
}

/**
 * List all R2 objects under a given prefix
 * e.g. prefix = "bulk-images/b2b/SKU001" → returns all files starting with that
 * Returns array of { key, url }
 */
export async function listR2Objects(prefix) {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET,
    Prefix: prefix,
  });

  const response = await R2.send(command);
  const contents = response.Contents || [];

  return contents.map((obj) => ({
    key: obj.Key,
    url: `${PUBLIC_URL}/${obj.Key}`,
  }));
}
