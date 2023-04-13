import React, { useEffect, useRef } from 'react'

var tileSize: number = 20;
var maxStackHeight: number;
var columns: column[] = [];
var fadeFactor = 0.1;

interface column {
  x: number;
  stackHeight: number;
  stackCounter: number;
}


function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    maxStackHeight = Math.ceil(canvas.height / tileSize);
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;
    console.log(canvas.height)
    console.log(canvas.width)
    // divide the canvas into columns
    for (let i = 0; i < canvas.width / tileSize; ++i) {
      var column: column = {
        x: i * tileSize,
        stackHeight: 10 + Math.random() * maxStackHeight,
        stackCounter: 0
      };
      columns.push(column);
    }

    const interval = setInterval(() => {
      draw(ctx!, canvas);
    }, 70);
    return () => clearInterval(interval);
  }, [canvasRef.current])

  return (
    <canvas className='flex-1 w-full' id="canvas" ref={canvasRef} />
  )

  function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
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
    }
  }
}

export default MatrixRain