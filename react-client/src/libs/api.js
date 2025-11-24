import ky from 'ky';

const baseURL = 'http://localhost:8080';

const api = ky.create({
  prefixUrl: baseURL,
  retry: 0,
  timeout: 60000,
  headers: {
    'Cache-Control': 'no-cache',
    Authorization: 'Bearer your-token-here',
  },
});

export const uploadFile = (apiUrl, file, onProgress, signal) => {
  const xhr = new XMLHttpRequest();

  const endpoint = new URL(apiUrl, baseURL);
  endpoint.search = new URLSearchParams({ filename: file.name });

  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const uploaded = Math.round((event.loaded / event.total) * 100);
        onProgress(uploaded);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ ok: true, status: xhr.status, data: JSON.parse(xhr.response) });
      } else {
        reject({ ok: false, data: `Upload failed with status ${xhr.status}` });
      }
    };

    xhr.onerror = () => {
      reject({ ok: false, data: 'Network error occurred during file upload' });
    };

    xhr.onabort = () => {
      reject({ ok: false, data: 'File upload aborted' });
    };

    if (signal) {
      signal.addEventListener('abort', () => xhr.abort());
    }

    xhr.open('POST', endpoint.toString(), true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('Authorization', 'Bearer your-token-here');
    xhr.send(file);
  });
};

const execute = async (endpoint, options) => {
  try {
    const res = await api(endpoint, {
      method: 'get',
      ...options,
    });
    const json = res.headers.get('content-type')?.includes('application/json');
    return {
      ok: true,
      data: json ? await res.json() : await res.text(),
    };
  } catch (error) {
    console.error(`Error for ${endpoint}:`, error);
    return { ok: false, data: error.message };
  }
};

export const getInfo = async () => {
  return await execute('app/info');
};
