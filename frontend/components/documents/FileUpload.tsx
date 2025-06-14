'use client';
import axios from 'axios';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  uploadUrl?: string;
}

export default function FileUpload({ uploadUrl = 'http://localhost:8000/api/upload' }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadProgress(0);
      setUploadStatus('Uploading...');

      await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });

      setUploadStatus('Upload Done');

      if (onUploadComplete) {
        onUploadComplete(); // misalnya akan setRefreshKey(prev => prev + 1)
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Oops! Error while uploading. Please contact our support.');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploadProgress(0);
    setUploadStatus('Uploading...');

    // Hanya ambil satu file untuk contoh ini
    uploadFile(acceptedFiles[0]).catch(() => {});
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <div className="dropzone upload">
      <div
        {...getRootProps()}
        className={`rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop Your File Here'
            : 'Drag and drop your file or click here to upload file'}
        </p>
      </div>

      {uploadProgress !== null && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {uploadProgress}% - {uploadStatus}
          </p>
        </div>
      )}
    </div>
  );
}
