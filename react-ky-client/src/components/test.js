import React, { useState, useRef } from 'react';
import { Button, LinearProgress, Typography, Box, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/**
 * A React component for file uploads with progress and authentication using XHR.
 */
const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error, aborted
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null); // Ref to store the XHR object for aborting

  const UPLOAD_URL = 'https://api.example.com/upload'; // Replace with your actual server endpoint
  const AUTH_TOKEN = 'your_super_secret_token'; // Replace with your actual token

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setUploadProgress(0);
      setUploadStatus('idle');
      setMessage('');
    }
  };

  const uploadFile = () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    setUploadStatus('uploading');
    setMessage('Upload started...');

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr; // Store the XHR object in a ref

    // --- Event Handlers ---
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploadStatus('success');
        setMessage('Upload successful!');
        // Optional: Process server response here
        // console.log(JSON.parse(xhr.responseText));
      } else {
        setUploadStatus('error');
        setMessage(`Upload failed: ${xhr.statusText || 'Unknown error'}`);
      }
    };

    xhr.onerror = () => {
      setUploadStatus('error');
      setMessage('Network error or request failed.');
    };

    xhr.onabort = () => {
      setUploadStatus('aborted');
      setMessage('Upload aborted by user.');
      setUploadProgress(0);
    };

    // --- Configuration and Send ---
    xhr.open('POST', UPLOAD_URL, true);
    xhr.setRequestHeader('Authorization', `Bearer ${AUTH_TOKEN}`);

    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  };

  const abortUpload = () => {
    if (xhrRef.current && uploadStatus === 'uploading') {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        MUI File Upload
      </Typography>

      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*" // Example accept attribute
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          component="label" // Use the button as a label to trigger the hidden input
          startIcon={<CloudUploadIcon />}
          onClick={handleButtonClick}
          disabled={uploadStatus === 'uploading'}
        >
          {file ? 'Change File' : 'Select File'}
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={uploadFile}
          disabled={!file || uploadStatus === 'uploading'}
        >
          Upload
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={abortUpload}
          disabled={uploadStatus !== 'uploading'}
        >
          Abort
        </Button>
      </Box>

      {file && (
        <Typography variant="body1" sx={{ mt: 1 }}>
          Selected file: **{file.name}**
        </Typography>
      )}

      {uploadStatus === 'uploading' && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            {uploadProgress}%
          </Typography>
        </Box>
      )}

      {message && (
        <Alert
          severity={
            uploadStatus === 'success' ? 'success' : uploadStatus === 'error' ? 'error' : 'info'
          }
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default FileUploadComponent;
