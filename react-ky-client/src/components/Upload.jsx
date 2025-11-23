import { useRef, useState } from 'react';
import { Box, Button, LinearProgress, Snackbar, Stack, TextField } from '@mui/material';
import { upload } from '../libs';

const Upload = ({ name = 'Upload', label = 'Label', sx }) => {
  const [value, setValue] = useState({ progress: 0, message: '' });
  const abortRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      abortRef.current = new AbortController();
      await upload(
        `http://localhost:8080/upload/file/${file.name}`,
        file,
        (progress, loaded, total) => {
          console.log(`>> Upload progress: ${progress}% (${loaded} of ${total} bytes)`);
          setValue({ progress: progress, message: `Uploading... ${progress}%` });
        },
        abortRef.current.signal
      )
        .then((data) => {
          console.log('>> Upload complete:', data);
          setValue({ progress: 100, message: data.message });
        })
        .catch((error) => {
          console.error('>> Upload failed:', error);
          setValue({ progress: 0, message: '' });
        })
        .finally(() => {
          abortRef.current = null;
        });
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <TextField
        name={name}
        label={label}
        placeholder={label}
        variant="outlined"
        fullWidth
        value={value.message}
        slotProps={{
          input: {
            endAdornment: (
              <Stack spacing={1} direction="row">
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
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    if (abortRef.current) {
                      abortRef.current.abort();
                    }
                    setValue({ progress: 0, message: 'Aborted' });
                  }}
                >
                  Abort
                </Button>
              </Stack>
            ),
          },
        }}
      />
      <LinearProgress variant="determinate" value={value.progress} sx={{ mb: 2 }} />

      <Snackbar
        open={!!value.message}
        autoHideDuration={6000}
        onClose={() => setValue({ ...value, message: '' })}
        message={value.message}
      />
    </Box>
  );
};

export default Upload;
