import { NextResponse } from 'next/server';
import { initS3 } from '@/utils/storage';

export async function GET() {
  try {
    // Initialize S3 client
    const s3 = initS3();
    
    // Test connection by listing buckets
    const buckets = await s3.listBuckets().promise();
    
    return NextResponse.json({
      success: true,
      message: 'S3 connection successful',
      buckets: buckets.Buckets?.map(bucket => bucket.Name) || []
    });
  } catch (error) {
    console.error('S3 connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'S3 connection failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}