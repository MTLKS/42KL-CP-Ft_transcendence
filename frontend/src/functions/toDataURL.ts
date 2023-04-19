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
