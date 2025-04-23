# S3 Storage Setup

This document outlines the S3 storage configuration for the Plagify application.

## Configuration

The application uses idcloudhost S3-compatible storage with the following configuration:

- **Bucket Name**: turnit-storage
- **Endpoint**: https://is3.cloudhost.id/turnit-storage
- **Region**: Not specified (using endpoint URL instead)

## Environment Variables

The following environment variables are used for S3 configuration:

```
S3_ENDPOINT=https://is3.cloudhost.id/turnit-storage
S3_ACCESS_KEY=H8SRD9WX0W38GWA00D6A
S3_SECRET_KEY=8gGITo8KV0UfMVKLy0EJcZX6XNOCKoZRCAOsxxJT
S3_BUCKET_NAME=turnit-storage
```

These variables are stored in the `.env.local` file.

## Implementation

### Server-Side Utilities

The S3 storage functionality is implemented in the following files:

1. `src/utils/storage.ts` - Core S3 functionality:
   - `initS3()` - Initializes the S3 client
   - `uploadFile()` - Uploads a file to S3
   - `deleteFile()` - Deletes a file from S3

2. `src/app/api/upload/route.ts` - API endpoint for file uploads
3. `src/app/api/test-storage/route.ts` - API endpoint for testing S3 connection

### Client-Side Utilities

Client-side utilities for working with storage are in:

- `src/utils/client-storage.ts` - Contains helper functions:
  - `uploadFile()` - Uploads a file via the API
  - `generateFilePath()` - Generates a unique file path
  - `testStorageConnection()` - Tests the S3 connection

### Testing Component

A test component is available at:

- `src/components/StorageTest.tsx` - UI component for testing S3 functionality
- `src/app/storage-test/page.tsx` - Page that uses the StorageTest component

## Usage Examples

### Uploading a File

```typescript
import { uploadFile } from '@/utils/client-storage';

// In an async function
const handleUpload = async (file: File) => {
  try {
    const result = await uploadFile(file);
    if (result.success) {
      console.log('File uploaded successfully:', result.url);
    } else {
      console.error('Upload failed:', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Deleting a File

This requires a server-side API call. Create an API endpoint that uses the `deleteFile` function from `storage.ts`.

## Testing

To test the S3 storage functionality:

1. Navigate to `/storage-test` in the application
2. Click "Test S3 Connection" to verify the connection
3. Select a file and click "Upload File" to test file uploads

## Troubleshooting

If you encounter issues with S3 storage:

1. Check that the environment variables are correctly set
2. Verify that the S3 bucket exists and is accessible
3. Check the browser console and server logs for error messages
4. Ensure the AWS SDK is properly installed