// Upload.jsx
import React from 'react';
import { Button, LinearProgress, Typography, Box } from '@mui/material';

const Upload = ({ onUpload, progress }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 단일 파일 선택
    if (file) {
      onUpload(file); // 상위 컴포넌트의 로직 실행
    }
    // 동일 파일 재선택을 위해 input 값 초기화
    event.target.value = null;
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
      <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          파일 선택 및 업로드 시작
        </Button>
      </label>

      {/* 진행률이 0보다 클 때만 Progress Bar 표시 */}
      {progress > 0 && progress <= 100 && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Upload;
