import { useState } from 'react';
import { Box, Button, LinearProgress, Snackbar, TextField } from '@mui/material';
import { upload } from '../libs';

function Upload({ name, onUpload }) {
  const [progress, setProgress] = useState(0);

  let uploadFile = null;

  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);

    uploadFile = upload(file, (percentComplete, transferredBytes, totalBytes) => {
      console.log(`${percentComplete}% - ${transferredBytes} of ${totalBytes} bytes`);
      setProgress(percentComplete);
    });

    uploadFile.promise
      .then((res) => {
        console.log('Upload promise resolved:', res);
      })
      .catch((err) => {
        console.error('Upload promise rejected:', err);
      })
      .finally(() => {
        console.log('Upload process finalized.');
        uploadFile = null;
      });

    // Simulate progress for demonstration purposes
    // let simulatedProgress = 0;
    // const interval = setInterval(() => {
    //   simulatedProgress += 10;
    //   setProgress(simulatedProgress);
    //   if (simulatedProgress >= 100) {
    //     clearInterval(interval);
    //   }
    // }, 1000);
  };

  console.log('Upload component rendered with progress:', progress);

  return (
    <Box>
      <TextField
        name={name}
        label="Select a file to upload"
        variant="outlined"
        fullWidth
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
                  <Button color="primary" variant="outlined" component="span">
                    Upload
                  </Button>
                </label>
              </Box>
            ),
          },
        }}
      />
      <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      <Button
        color="primary"
        variant="outlined"
        onClick={() => {
          if (uploadFile) {
            uploadFile.abort();
          }
          setProgress(0);
        }}
      >
        Abort
      </Button>
    </Box>
  );
}

export default Upload;
