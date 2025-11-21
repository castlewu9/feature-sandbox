import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:8080',
  timeout: 60000,
  retry: false,
});

export const uploadFile = async (filename, data, callbackFn) => {
  try {
    const res = await api.post(`upload/file/${encodeURIComponent(filename)}`, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: data,
      onUploadProgress: callbackFn,
      //   onUploadProgress: (progress, chunk) => {
      //     const percent = Math.floor(progress.percent * 100);
      //     progressElement.value = percent;
      //     statusElement.textContent = `Status: Uploading ${percent}% (${progress.transferredBytes} of ${progress.totalBytes} bytes)`;
      //     console.log(
      //       `${percent}% - ${progress.transferredBytes} of ${progress.totalBytes} bytes uploaded`
      //     );
      //   },
    });
    const result = await res.json();
    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    return {
      ok: false,
      data: error.message,
    };
  }
};
