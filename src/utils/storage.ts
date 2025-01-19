import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: 'tourism-education',
  keyFilename: 'tourism-education-key.json'
});

const bucketName = 'tourism-education';
const bucket = storage.bucket(bucketName);

export const uploadFile = async (file: File): Promise<string> => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2);
  const fileExtension = file.name.split('.').pop();
  const fileName = `${timestamp}_${randomString}.${fileExtension}`;

  // File 객체를 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 파일 업로드
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.type,
      metadata: {
        originalName: file.name
      }
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(new Error(`파일 업로드 실패: ${err.message}`));
    });

    blobStream.on('finish', async () => {
      // 파일의 공개 URL 생성
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      resolve(publicUrl);
    });

    blobStream.end(buffer);
  });
}; 