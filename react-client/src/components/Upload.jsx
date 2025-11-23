import React, { useRef, useState } from 'react';
import { Box, Button, LinearProgress, Stack, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '../libs/api';

const Upload = ({ name, label, placeholder, sx, onUpload }) => {
  const [uploadProgress, setUploadProgress] = useState({ value: 0, message: '' });
  const abortRef = useRef(null);
  // const [fileName, setFileName] = useState('');
  // const fileInputRef = useRef(null); // Ref to the actual input element

  // const handleFileChange = (event) => {
  //   const files = event.target.files;
  //   if (files && files.length > 0) {
  //     // Set the file name for display in the TextField
  //     setFileName(files[0].name);
  //     // Process the file data as needed here
  //     console.log('Selected file:', files[0]);
  //   } else {
  //     setFileName('');
  //   }
  // };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        abortRef.current = new AbortController();
        const res = uploadFile(
          `/upload/file/${file.name}`,
          file,
          (progress, loaded, total) => {
            console.log(`>> Upload progress: ${progress}% (${loaded} of ${total} bytes)`);
          },
          abortRef.current.signal
        );
        if (res.ok) {
          console.log('File uploaded successfully:', res.data);
          setUploadProgress({ value: 100, message: 'Upload complete' });
          if (onUpload) {
            onUpload(file);
          }
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadProgress({ value: 0, message: 'Upload failed' });
      } finally {
        abortRef.current = null;
      }
    }
    // if (files && files.length > 0) {
    //   // Process the file data as needed here
    //   console.log('Selected file:', files[0]);
    //   if (onUpload) {
    //     onUpload(files[0]);
    //   }
    // }
  };

  const handleAbort = () => {
    // Implement abort logic if applicable
    console.log('Upload aborted');
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <TextField
        name={name}
        label={label}
        placeholder={placeholder}
        variant="outlined"
        fullWidth
        slotProps={{
          input: {
            readOnly: true,
            startAdornment: <CloudUploadIcon sx={{ mr: 2 }} />,
            endAdornment: (
              <Stack spacing={1} direction="row">
                <label htmlFor={`upload-${name}`}>
                  <input
                    id={`upload-${name}`}
                    name={name}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                  />
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </label>
                <Button color="primary" variant="outlined" onClick={handleAbort}>
                  Abort
                </Button>
              </Stack>
            ),
          },
        }}
      />
      <LinearProgress variant="determinate" value={uploadProgress.value} />
    </Box>
  );
};

export default Upload;
