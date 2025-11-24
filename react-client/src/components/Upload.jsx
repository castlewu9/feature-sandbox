import React, { useRef, useState } from 'react';
import { Box, Button, LinearProgress, Stack, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '../libs/api';

const Upload = ({ name, label, placeholder, sx, onUpload }) => {
  const [uploadProgress, setUploadProgress] = useState({ value: 0, message: '' });
  const abortRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        abortRef.current = new AbortController();
        const res = await uploadFile(
          '/api/upload',
          file,
          (progress) => {
            setUploadProgress({ value: progress, message: `Uploading... ${progress}%` });
          },
          abortRef.current.signal
        );
        if (res.ok) {
          setUploadProgress({ value: 0, message: res.data.value });
          if (onUpload) {
            onUpload(file);
          }
        } else {
          setUploadProgress({ value: 0, message: '' });
        }
      } catch (error) {
        setUploadProgress({ value: 0, message: error.data });
      } finally {
        abortRef.current = null;
      }
    }
  };

  const handleAbort = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <TextField
        name={name}
        value={uploadProgress.message}
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
