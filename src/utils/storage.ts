import AWS from 'aws-sdk';

export const initS3 = () => {
  const s3 = new AWS.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    s3ForcePathStyle: true, // Needed for some S3-compatible services
    signatureVersion: 'v4',
  });

  return s3;
};

export const uploadFile = async (file: File, path: string) => {
  const s3 = initS3();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: path,
    Body: file,
    ContentType: file.type,
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (path: string) => {
  const s3 = initS3();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: path,
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};