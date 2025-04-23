import { NextRequest, NextResponse } from 'next/server';
import { initS3 } from '@/utils/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file provided' 
      }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json({ 
        success: false, 
        message: 'No path provided' 
      }, { status: 400 });
    }

    // Initialize S3 client
    const s3 = initS3();

    // Convert File to Buffer for S3 upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: path,
      Body: buffer,
      ContentType: file.type,
    };

    const result = await s3.upload(params).promise();

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: result.Location,
      key: result.Key
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// Increase the limit for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};