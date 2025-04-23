'use client';

import { useState } from 'react';
import { uploadFile, testStorageConnection } from '@/utils/client-storage';

export default function StorageTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('Testing connection...');
    const result = await testStorageConnection();
    
    if (result.success) {
      setConnectionStatus(`Connection successful! Available buckets: ${result.buckets?.join(', ') || 'none'}`);
    } else {
      setConnectionStatus(`Connection failed: ${result.message}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      const result = await uploadFile(file);

      if (result.success && result.url) {
        setUploadedUrl(result.url);
      } else {
        setError(result.message || 'Upload failed');
      }
    } catch (err) {
      setError(`Error uploading file: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">S3 Storage Test</h2>
      
      <div className="mb-6">
        <button 
          onClick={testConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Test S3 Connection
        </button>
        
        {connectionStatus && (
          <div className={`mt-2 p-3 rounded ${connectionStatus.includes('successful') ? 'bg-green-100' : 'bg-red-100'}`}>
            {connectionStatus}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a file to upload
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`px-4 py-2 rounded ${
          !file || uploading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 transition'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          <p>File uploaded successfully!</p>
          <a 
            href={uploadedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
}