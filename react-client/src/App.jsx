import { useRef } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import Upload from './components/Upload';
import { getInfo } from './libs/api';

const App = () => {
  const values = useRef(null);

  const onUpload = (result) => {
    console.log('File uploaded:', result);
    values.current = result;
  };

  return (
    <>
      <Typography color="primary" variant="h6">
        File Upload & Download
      </Typography>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#f5f5f5',
          p: 4,
          border: '2px dashed #1976d2',
          mt: 2,
          width: '80%',
        }}
      >
        <Upload
          name="fileUpload"
          label="Upload File"
          placeholder="Select a file to upload"
          onUpload={onUpload}
        />
      </Paper>
      <Button
        onClick={async () => {
          const info = await getInfo();
          console.log('App Info:', info);
        }}
      >
        Get App Info
      </Button>
    </>
  );
};

export default App;
