import ky from 'ky';

const baseURL = 'http://localhost:8080';

const api = ky.create({
  prefixUrl: baseURL,
  timeout: 60000,
  retry: false,
});

export const download = async (filename) => {
  try {
    const res = await api.get(`download/file/${encodeURIComponent(filename)}`, {
      onDownloadProgress: (progress) => {
        console.log('Download progress:', progress);
      },
    });
    const blob = await res.blob();

    // const fileUrl = 'path/to/your/file.pdf'; // Replace with your file URL
    // const fileName = 'MyDocument.pdf'; // Desired filename

    // const link = document.createElement('a');
    // link.href = fileUrl;
    // link.download = fileName;
    // document.body.appendChild(link); // Append to body temporarily
    // link.click(); // Programmatically click the link
    // document.body.removeChild(link); // Remove the link
    return { ok: true, data: URL.createObjectURL(blob) };
  } catch (error) {
    console.error('Download failed:', error);
    return { ok: false, data: error.message };
  }
};

export const uploadFile = (file, timeout = 300000, onProgress, abortSignal) => {
  const xhr = new XMLHttpRequest();
  xhr.timeout = timeout;

  const filename = encodeURIComponent(file.name);
  console.log('==> Uploading file via uploadFile function:', file);

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      console.log('==> Upload onprogress event:', event);
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress, event.loaded, event.total);
      }
    };

    xhr.onloadend = () => {
      console.log('==> Upload onloadend event:', xhr);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(`${xhr.statusText} (Status: ${xhr.status})`);
      }
    };

    xhr.onerror = () => {
      console.log('==> Upload onerror event:', xhr);
      reject(`${xhr.statusText} (Status: ${xhr.status})`);
    };

    xhr.onabort = () => {
      console.log('==> Upload onabort event:', xhr);
      reject('Upload aborted by user');
    };

    xhr.ontimeout = () => {
      console.log('==> Upload ontimeout event:', xhr);
      reject('Upload timed out');
    };

    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        xhr.abort();
      });
    }

    xhr.open('POST', `${baseURL}/upload/file/${filename}`, true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Authorization', 'Bearer 123');
    xhr.send(file);
  });
};

/**
 * Uploads a file to the server with progress reporting.
 *
 * @param {Object} file - File object to upload
 * @param {Function} progressCallback - Callback function to report progress
 */
export const upload = (file, progressCallback, completeCallback) => {
  const xhr = new XMLHttpRequest();
  const filename = encodeURIComponent(file.name);
  console.log('==> Uploading file via upload function:', file);

  xhr.upload.onprogress = (event) => {
    console.log('==> Upload onprogress event:', event);
    if (event.lengthComputable && progressCallback) {
      const progress = Math.round((event.loaded / event.total) * 100);
      progressCallback(progress, event.loaded, event.total);
    }
  };

  xhr.onloadend = () => {
    console.log('==> Upload onloadend event:', xhr);
    if (xhr.status >= 200 && xhr.status < 300) {
      completeCallback(true, JSON.parse(xhr.responseText));
    } else {
      completeCallback(false, `${xhr.statusText} (Status: ${xhr.status})`);
    }
  };

  xhr.onerror = () => {
    console.log('==> Upload onerror event:', xhr);
    completeCallback(false, `${xhr.statusText} (Status: ${xhr.status})`);
  };

  xhr.onabort = () => {
    console.log('==> Upload onabort event:', xhr);
    completeCallback(false, 'Upload aborted by user');
  };

  xhr.open('POST', `${baseURL}/upload/file/${filename}`, true);
  xhr.setRequestHeader('Cache-Control', 'no-cache');
  xhr.setRequestHeader('Authorization', 'Bearer 123');
  xhr.send(file);

  return xhr;
};
