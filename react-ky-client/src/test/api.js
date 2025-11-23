// api.js
export const uploadFileApi = (endpoint, file, onProgress) => {
  const xhr = new XMLHttpRequest();
  let aborted = false;

  const promise = new Promise((resolve, reject) => {
    // [1] 업로드 진행률 추적
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    });

    // [2] 요청 완료 (성공/실패) 처리
    xhr.addEventListener('load', () => {
      if (aborted) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          resolve(xhr.responseText); // JSON이 아닌 응답 처리
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    });

    // [3] 네트워크 오류 처리
    xhr.addEventListener('error', () => {
      if (aborted) return;
      reject(new Error('Network error occurred during upload.'));
    });

    // [4] 중단(abort) 이벤트 처리
    xhr.addEventListener('abort', () => {
      aborted = true;
      reject(new Error('Upload aborted by user/component unmount.'));
    });

    // [5] 요청 설정 및 전송
    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name)); // 파일 이름은 헤더로 전달
    xhr.send(file); // File 객체를 직접 전송
  });

  // 중단 기능을 외부에서 사용할 수 있도록 반환
  return {
    promise,
    abort: () => {
      if (!aborted) {
        xhr.abort();
        aborted = true;
      }
    },
  };
};
