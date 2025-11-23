import { useRef, useState } from 'react';
import { Box, Button, LinearProgress, Snackbar, TextField, Typography } from '@mui/material';
import { upload, uploadFile } from '../libs';

function Upload({ name }) {
  const [uploadProgress, setUploadProgress] = useState({ value: '', percentage: 0 });
  const uploadRef = useRef(null);
  const abortControllerRef = useRef(null);

  //   const handleUpload = (e) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       uploadRef.current = upload(
  //         file,
  //         (progress, loaded, total) => {
  //           console.log(`Upload progress: ${progress}% (${loaded} of ${total} bytes)`);
  //           setUploadProgress(progress);
  //         },
  //         (result, data) => {
  //           setUploadProgress(0);
  //           console.log('Upload complete:', result, data);
  //           if (result === true) {
  //             setValue(data.message);
  //           }
  //         }
  //       );
  //     }
  //   };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      abortControllerRef.current = new AbortController();
      await uploadFile(
        file,
        300000,
        (progress, loaded, total) => {
          console.log(`Upload progress: ${progress}% (${loaded} of ${total} bytes)`);
          setUploadProgress({ value: `Uploading... ${progress}%`, percentage: progress });
        },
        abortControllerRef.current.signal
      )
        .then((data) => {
          setUploadProgress({ value: data.message, percentage: 0 });
          console.log('Upload complete:', data);
        })
        .catch((error) => {
          console.error('Upload failed:', error);
          setUploadProgress({ value: `Upload failed: ${error}`, percentage: 0 });
        })
        .finally(() => {
          abortControllerRef.current = null;
        });
    }
  };

  return (
    <Box>
      <TextField
        name={name}
        label="Select a file to upload"
        variant="outlined"
        fullWidth
        value={uploadProgress.value}
        slotProps={{
          input: {
            endAdornment: (
              <Box sx={{ mx: 1 }}>
                <label htmlFor={`upload-${name}`}>
                  <input
                    id={`upload-${name}`}
                    name={`upload-${name}`}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                  />
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </label>
              </Box>
            ),
          },
        }}
      />
      <LinearProgress variant="determinate" value={uploadProgress.percentage} sx={{ mt: 2 }} />
      {/* <Box sx={{ width: '100%', mt: 2 }}>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
          {uploadProgress}%
        </Typography>
      </Box> */}
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
          setUploadProgress({ value: 'Aborted', percentage: 0 });
        }}
      >
        Abort
      </Button>
    </Box>
  );
}

export default Upload;
