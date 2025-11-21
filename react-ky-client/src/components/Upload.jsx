import { useState } from 'react';
import { Box, Button, LinearProgress, Snackbar, TextField } from '@mui/material';
import FileHandler from '../libs/FileHandler';

function Upload({ name, onUpload }) {
  const [progress, setProgress] = useState(0);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);

    FileHandler.readFile(file)
      .then((data) => {
        console.log('File data:', data);
        onUpload(file.name, data, (progress) => {
          const percent = Math.floor(progress.percent * 100);
          // progressElement.value = percent;
          console.log(
            `${percent}% - ${progress.transferredBytes} of ${progress.totalBytes} bytes uploaded`
          );
        });
      })
      .catch((error) => {
        console.error('Error reading file:', error);
        Snackbar.open({ message: 'Error reading file', severity: 'error' });
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
    </Box>
  );
}

export default Upload;
