import React, { useEffect, useRef, useState } from 'react'

interface PixelatedImageProps {
  src: string;
  pixelSize?: number;
  className?: string;
}

function PixelatedImage(props: PixelatedImageProps) {
  const [image, setImage] = useState<HTMLImageElement>(new Image());
  const { src, pixelSize = 1, className } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    cacheImage()
  }, [src]);

  useEffect(() => {
    draw();
  }, [pixelSize]);

  return (
    <canvas id="canvas" ref={canvasRef} className={className} />
  )
  function cacheImage() {
    const img = new Image();
    img.src = src;
    setImage(img);
  }

  function draw() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    image.src = src;
    // image.src = 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*';
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx!.imageSmoothingEnabled = false;
      (canvas as any).willReadFrequently = true;
      ctx!.drawImage(image, 0, 0);

      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y += pixelSize) {
        for (let x = 0; x < canvas.width; x += pixelSize) {
          const pixelIndex = (y * canvas.width + x) * 4;
          const r = imageData.data[pixelIndex];
          const g = imageData.data[pixelIndex + 1];
          const b = imageData.data[pixelIndex + 2];
          for (let i = 0; i < pixelSize; i++) {
            for (let j = 0; j < pixelSize; j++) {
              const row = y + i;
              const col = x + j;
              const index = (row * canvas.width + col) * 4;
              imageData.data[index] = r;
              imageData.data[index + 1] = g;
              imageData.data[index + 2] = b;
            }
          }
        }
      }
      ctx!.putImageData(imageData, 0, 0);
    }

  }
}

export default PixelatedImage