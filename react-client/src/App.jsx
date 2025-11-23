import { useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import Upload from './components/Upload';

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
      </Typography>
    </>
  );
};

export default App;
