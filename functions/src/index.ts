import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';

admin.initializeApp();
const storage = new Storage();
const bucket = storage.bucket('tourism-education');

export const generateUploadUrl = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '로그인이 필요합니다.');
  }

  const { contentType, fileName } = data;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2);
  const fileExtension = fileName.split('.').pop();
  const newFileName = `${timestamp}_${randomString}.${fileExtension}`;

  const [url] = await bucket.file(newFileName).getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 15 * 60 * 1000, // 15분
    contentType
  });

  return {
    url,
    fileName: newFileName,
    publicUrl: `https://storage.googleapis.com/${bucket.name}/${newFileName}`
  };
}); 