import React, { useEffect, useRef, useState } from 'react'
import sleep from '../functions/sleep';

var tileSize: number = 20;
var maxStackHeight: number;

var fadeFactor = 0.1;

interface column {
  x: number;
  stackHeight: number;
  stackCounter: number;
}

interface MatrixRainProps {
  animate?: boolean;
}

function MatrixRain(props: MatrixRainProps) {
  const { animate } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  var columns: column[] = [];

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      columns = [];
      for (let i = 0; i < canvas.width / tileSize; ++i) {
        var column: column = {
          x: i * tileSize,
          stackHeight: 10 + Math.random() * maxStackHeight,
          stackCounter: 0
        };
        columns.push(column);
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    handleResize();

    return () => observer.unobserve(container);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    maxStackHeight = Math.ceil(canvas.height / tileSize);
    // divide the canvas into columns
    for (let i = 0; i < canvas.width / tileSize; ++i) {
      var column: column = {
        x: i * tileSize,
        stackHeight: 10 + Math.random() * maxStackHeight,
        stackCounter: 0
      };
      columns.push(column);
    }


    requestAnimationFrame(() => draw(ctx!, canvas));
  }, [animate])

  return (
    <div className='relative w-full h-full flex-1' ref={containerRef}>
      <canvas className='absolute h-full w-full top-0 left-0' id="canvas" ref={canvasRef}
        onClick={(e) => { e.preventDefault(); }}
      />
    </div>
  )

  async function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    {
      // draw a semi transparent black rectangle on top of the scene to slowly fade older characters
      ctx.fillStyle = `rgba( 36, 36, 36 , ${fadeFactor} )`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // pick a font slightly smaller than the tile size
      ctx.font = `${tileSize - 10}px jetbrains mono`;
      ctx.fillStyle = "rgb( 254, 248, 226, 0.4 )";
      for (let i = 0; i < columns.length; ++i) {
        // pick a random ascii character (change the 94 to a higher number to include more characters)
        var randomCharacter = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        ctx.fillText(randomCharacter, columns[i].x, columns[i].stackCounter * tileSize + tileSize);

        // if the stack is at its height limit, pick a new random height and reset the counter
        if (++columns[i].stackCounter >= columns[i].stackHeight) {
          columns[i].stackHeight = 10 + Math.random() * maxStackHeight;
          columns[i].stackCounter = 0;
        }
      }
      await sleep(70);
      requestAnimationFrame(() => draw(ctx, canvas));
    }
  }
}

export default MatrixRain