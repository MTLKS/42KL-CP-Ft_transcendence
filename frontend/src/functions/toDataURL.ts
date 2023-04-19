export async function toDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      // console.log(reader.s);
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Failed to conver URL to data URL'));
    };
    reader.readAsDataURL(blob);
  })
}

export async function urlToFile(url: string, username: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileExtension = url.split('.').pop();
  const filename = username || `${username}.${fileExtension}`
  return new File([blob], filename, { type: blob.type });
}

export function dataUrlToBlob(dataUrl: string, filename: string): Blob {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
