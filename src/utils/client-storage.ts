/**
 * Client-side utility functions for file storage operations
 */

/**
 * Upload a file to the server, which will then upload it to S3
 * @param file The file to upload
 * @param customPath Optional custom path/filename to use (if not provided, a default path will be generated)
 * @returns Promise with the upload result
 */
export async function uploadFile(file: File, customPath?: string): Promise<{
  success: boolean;
  url?: string;
  key?: string;
  message?: string;
  error?: string;
}> {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    // Generate a path if not provided
    const path = customPath || generateFilePath(file);
    formData.append('path', path);

    // Send the file to the server
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Generate a file path for S3 storage
 * @param file The file to generate a path for
 * @param prefix Optional prefix for the file path (default: 'uploads')
 * @returns A unique file path
 */
export function generateFilePath(file: File, prefix: string = 'uploads'): string {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileName = file.name.replace(/\s+/g, '-').toLowerCase();
  
  return `${prefix}/${timestamp}-${randomString}-${fileName}`;
}

/**
 * Test the connection to S3 storage
 * @returns Promise with the connection test result
 */
export async function testStorageConnection(): Promise<{
  success: boolean;
  message: string;
  buckets?: string[];
  error?: string;
}> {
  try {
    const response = await fetch('/api/test-storage');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Error testing connection',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}