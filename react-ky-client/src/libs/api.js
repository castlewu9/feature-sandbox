export const upload = (endpoint, file, onProgress, abortSignal) => {
  const xhr = new XMLHttpRequest();

  const promise = new Promise((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent, event.loaded, event.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve({ status: xhr.status, data: JSON.parse(xhr.responseText) });
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during upload.'));
    };

    xhr.onabort = () => {
      reject(new Error('Upload aborted by user/component unmount.'));
    };

    xhr.onloadend = () => {
      // Cleanup if necessary after load ends
    };

    xhr.open('POST', endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    // xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Authorization', 'Bearer 123');
    xhr.send(file);
  });

  return {
    promise,
    abort: () => {
      xhr.abort();
    },
  };
};
