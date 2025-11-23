// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import Upload from './Upload';
import { uploadFileApi } from './api';
import { Typography, Container, Alert, Button } from '@mui/material';

const App = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState(null);

  // 진행 중인 XHR 요청 객체를 참조하기 위한 ref
  const activeRequest = useRef(null);

  // 서버 엔드포인트는 여기서 정의합니다.
  const API_ENDPOINT = 'YOUR_SERVER_ENDPOINT';

  const handleUpload = async (file) => {
    setUploadStatus('Uploading...');
    setUploadProgress(0);
    setError(null);

    // 새 업로드 시작 전, 기존 업로드가 있다면 중단 처리
    if (activeRequest.current) {
      activeRequest.current.abort();
    }

    // api.js 함수 호출 및 반환된 { promise, abort } 객체 저장
    const request = uploadFileApi(API_ENDPOINT, file, (progress) => {
      setUploadProgress(progress); // 진행률 UI 업데이트를 위한 상태 설정
    });

    activeRequest.current = request; // 현재 활성 요청으로 등록

    try {
      await request.promise; // 업로드 완료 대기
      setUploadStatus('Upload successful!');
      setUploadProgress(100);
    } catch (err) {
      // 중단으로 인한 에러는 별도 처리 (UI 상태만 변경)
      if (err.message === 'Upload aborted by user/component unmount.') {
        setUploadStatus('Upload cancelled.');
      } else {
        setError(err.message);
        setUploadStatus('Upload failed.');
      }
    } finally {
      activeRequest.current = null; // 요청 완료/실패/중단 후 ref 초기화
    }
  };

  const handleCancelUpload = () => {
    if (activeRequest.current) {
      activeRequest.current.abort();
      // 상태 업데이트는 api.js의 catch 블록에서 이루어집니다.
    }
  };

  // 컴포넌트 언마운트 시 (화면 전환 등) 자동 업로드 중단
  useEffect(() => {
    return () => {
      if (activeRequest.current) {
        activeRequest.current.abort();
        activeRequest.current = null;
        console.log('Component unmounted, upload aborted automatically.');
      }
    };
  }, []); // 빈 배열은 컴포넌트 마운트/언마운트 시에만 실행

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Octet Stream 파일 업로드
      </Typography>
      <Upload onUpload={handleUpload} progress={uploadProgress} />

      {uploadStatus === 'Uploading...' && (
        <Button onClick={handleCancelUpload} variant="outlined" color="secondary" sx={{ mt: 2 }}>
          업로드 취소
        </Button>
      )}

      {uploadStatus && <Typography sx={{ mt: 2 }}>상태: {uploadStatus}</Typography>}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          오류: {error}
        </Alert>
      )}
    </Container>
  );
};

export default App;
