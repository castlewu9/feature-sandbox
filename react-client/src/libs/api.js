const baseURL = 'http://localhost:8080';

export const uploadFile = (endpoint, file, onProgress, abortSignal) => {
  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const uploaded = Math.round((event.loaded / event.total) * 100);
        onProgress(uploaded, event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      console.log('==> Upload onload event:', xhr.status, xhr.response);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true, status: xhr.status, data: JSON.parse(xhr.response) });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      console.log('==> Upload onerror event:', xhr.status, xhr.response);
      reject(new Error('Network error occurred during file upload'));
    };

    xhr.onabort = () => {
      console.log('==> Upload onabort event:', xhr.status, xhr.response);
      reject(new Error('File upload aborted'));
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => xhr.abort());
    }

    xhr.open('POST', `${baseURL}${endpoint}`, true);
    // xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Authorization', 'Bearer your-token-here');
    xhr.send(file);
  });
};
