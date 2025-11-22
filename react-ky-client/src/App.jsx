import { useState } from 'react';
import { Button, Divider, LinearProgress, Paper, Snackbar, Stack } from '@mui/material';
import { Upload } from './components';

const App = () => {
  const [open, setOpen] = useState(false);

  const handleUpload = async (file, callbackFn) => {};

  const handleDownload = async () => {
    try {
      const response = await fetch('http://localhost:8080/download/file/bird.jpg');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bird.jpg';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ backgroundColor: '#f5f5f5', width: '50%' }}>
        <Stack
          spacing={2}
          direction="column"
          sx={{
            border: '2px dashed #1976d2',
            borderRadius: 1,
            py: 2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Upload name="file" onUpload={handleUpload} />

          <Divider sx={{ width: '80%', my: 10 }} />
          <label htmlFor="download-button">
            <input
              style={{ display: 'none' }}
              id="download-button"
              name="download-button"
              type="file"
              onChange={handleDownload}
            />
            <Button color="primary" variant="outlined" component="span">
              Upload
            </Button>
          </label>
          <LinearProgress />
        </Stack>
      </Paper>
      {/* <Snackbar open={open} autoHideDuration={5000} onClose={() => {}}> */}
      {/* <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}> */}
      {/* Upload successful! */}
      {/* </Alert> */}
      {/* </Snackbar> */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message="I love snacks"
        key={'topcenter'}
      />
    </>
  );
};

export default App;
