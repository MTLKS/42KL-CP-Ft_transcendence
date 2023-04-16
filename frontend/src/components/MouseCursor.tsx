import React, { forwardRef, useRef, useState } from 'react'
import sleep from '../functions/sleep';

interface Offset {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}

enum CursorType {
  Default = 'absolute w-5 h-5 border-highlight rounded-full border-2',
  Button = 'pointer',
  HDrag = 'ew-resize',
  VDrag = 'ns-resize',
  Drag = 'move',
  Text = 'text',
  hover = 'hover',
}

interface CursorSizes {
  size1Default: Size
  size2Default: Size
  size3Default: Size
  size4Default: Size
}

const defaultCurser: CursorSizes = {
  size1Default: { width: 30, height: 30 },
  size2Default: { width: 18, height: 18 },
  size3Default: { width: 16, height: 16 },
  size4Default: { width: 6, height: 6 },
};
const hDCursor: CursorSizes = {
  size1Default: { width: 30, height: 30 },
  size2Default: { width: 18, height: 18 },
  size3Default: { width: 50, height: 16 },
  size4Default: { width: 6, height: 6 },
};
const vDCursor: CursorSizes = {
  size1Default: { width: 30, height: 30 },
  size2Default: { width: 18, height: 18 },
  size3Default: { width: 16, height: 50 },
  size4Default: { width: 6, height: 6 },
};
const dCursor: CursorSizes = {
  size1Default: { width: 30, height: 30 },
  size2Default: { width: 50, height: 18 },
  size3Default: { width: 16, height: 50 },
  size4Default: { width: 6, height: 6 },
};
const textCursor: CursorSizes = {
  size1Default: { width: 8, height: 40 },
  size2Default: { width: 5, height: 25 },
  size3Default: { width: 4, height: 20 },
  size4Default: { width: 2, height: 10 },
};



let timerId: NodeJS.Timeout | null = null;
let intervalId: NodeJS.Timeout | null = null;
let holdCount: number = 0;
let currentCursorType: CursorType = CursorType.Default;

const longPressDuration: number = 200;

interface MouseCursorProps {
  children: JSX.Element | JSX.Element[];
}

const MouseCursor = forwardRef((props: MouseCursorProps, ref) => {
  const { size1Default, size2Default, size3Default, size4Default } = defaultCurser;

  const [offset1, setOffset1] = useState<Offset>({ x: -100, y: -100 });
  const [offset2, setOffset2] = useState<Offset>({ x: -100, y: -100 });
  const [offset3, setOffset3] = useState<Offset>({ x: -100, y: -100 });
  const [offset4, setOffset4] = useState<Offset>({ x: -100, y: -100 });
  const [size1, setSize1] = useState<Size>(size1Default);
  const [size2, setSize2] = useState<Size>(size2Default);
  const [size3, setSize3] = useState<Size>(size3Default);
  const [size4, setSize4] = useState<Size>(size4Default);
  const [longPressDetected, setLongPressDetected] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div className='relative cursor-none w-full h-full'
      style={{ pointerEvents: currentCursorType == CursorType.hover ? 'none' : 'auto' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={onMouseMove}
    >

      {props.children}
      <div className={`absolute pointer-events-none border-highlight border-4 z-50 ${currentCursorType == CursorType.hover ? " " : "transform -translate-x-1/2 -translate-y-1/2 "} `}
        style={{
          left: offset1.x, top: offset1.y, width: size1.width, height: size1.height,
          borderRadius: currentCursorType == CursorType.hover ? '10px' : '50%',
          mixBlendMode: 'difference'
        }}
      />
      <div className='absolute pointer-events-none border-highlight rounded-full border-2 z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-60 '
        style={{
          left: offset2.x, top: offset2.y, width: size2.width, height: size2.height,
          mixBlendMode: 'difference'
        }}
      />
      <div className='absolute pointer-events-none border-highlight rounded-full border-2 z-50 transform -translate-x-1/2 -translate-y-1/2 opacity-60 '
        style={{
          left: offset3.x, top: offset3.y, width: size3.width, height: size3.height,
          mixBlendMode: 'difference'
        }}
      />
      <div className='absolute pointer-events-none bg-highlight rounded-full transform  z-50 -translate-x-1/2 -translate-y-1/2 '
        style={{
          left: offset4.x, top: offset4.y, width: size4.width, height: size4.height,
          mixBlendMode: 'difference'
        }}
      />
    </div>
  );
  async function onMouseMove(e: React.MouseEvent) {
    await sleep(40);
    if (currentCursorType != CursorType.hover) {
      setOffset1({ x: e.clientX, y: e.clientY });
      await sleep(40);
    }
    setOffset2({ x: e.clientX, y: e.clientY });
    await sleep(60);
    setOffset3({ x: e.clientX, y: e.clientY });
    await sleep(100);
    setOffset4({ x: e.clientX, y: e.clientY });
  }

  async function shortPressAnimation() {
    let i: number = 0;
    while (i < 15) {
      if (currentCursorType != CursorType.hover)
        setSize1({ width: size1Default.width + i * 3, height: size1Default.height + i * 3 });
      if (i > 2) setSize2({ width: size2Default.width + i * 2, height: size2Default.height + i * 2 });
      if (i > 4) setSize3({ width: size3Default.width + i, height: size3Default.height + i });
      if (i > 8) setSize4({ width: size4Default.width + i, height: size4Default.height + i });
      await sleep(5);
      i++;
    }
    await sleep(20);
    while (i >= 0) {
      if (currentCursorType != CursorType.hover)
        setSize1({ width: size1Default.width + i * 3, height: size1Default.height + i * 3 });
      setSize2({ width: size2Default.width + i * 2, height: size2Default.height + i * 2 });
      setSize3({ width: size3Default.width + i, height: size3Default.height + i });
      setSize4({ width: size4Default.width + i, height: size4Default.height + i });
      await sleep(5);
      i--;
    }
  }

  function handleHoverStart(objectSize: Size, objectOffset: Offset, cursorType: CursorType, cursorPosition: Offset) {
    currentCursorType = cursorType;
    setSize1({ width: objectSize.width + 30, height: objectSize.height + 30 });
    setOffset1({ x: objectOffset.x - (cursorPosition.x / 2 - cursorPosition.x) / 10 - 30, y: objectOffset.y - (cursorPosition.y / 2 - cursorPosition.y) / 10 - 30 });
  }

  function handleHover(objectSize: Size, objectOffset: Offset, cursorPosition: Offset) {
    setSize1({ width: objectSize.width + 30, height: objectSize.height + 30 });
    setOffset1({ x: objectOffset.x - (cursorPosition.x / 2 - cursorPosition.x) / 10 - 30, y: objectOffset.y - (cursorPosition.y / 2 - cursorPosition.y) / 10 - 30 });
  }

  function handleHoverEnd() {
    currentCursorType = CursorType.Default;
    setSize1(size1Default);
  }

  function shortPress() {
    shortPressAnimation();
  }

  function longPressEndAnimation() {
    shortPressAnimation();
  }

  function longPress() {
    holdCount = 0;
    intervalId = setInterval(async () => {
      const num1 = Math.floor(Math.random() * 20);
      const num2 = Math.floor(Math.random() * 20);
      setSize2({ width: 6 + num1, height: 6 + num1 });
      setSize3({ width: 6 + num2, height: 6 + num2 });
      holdCount++;
    }, 40);
  }

  function longPressRealeased() {
    if (intervalId) clearInterval(intervalId);
    setSize2({ width: size2Default.width, height: size2Default.height });
    setSize3({ width: size3Default.width, height: size3Default.height });
    longPressEndAnimation();
  }

  function handleMouseDown() {
    setLongPressDetected(false);
    timerId = setTimeout(() => {
      longPress();
      setLongPressDetected(true);
    }, longPressDuration);
  }

  function handleMouseUp() {
    if (timerId) clearTimeout(timerId!);
    if (!longPressDetected) shortPress();
    else longPressRealeased();
    setLongPressDetected(false);
  }

  function handleTouchStart() {
    setLongPressDetected(false);
    timerId = setTimeout(() => {
      longPress();
      setLongPressDetected(true);
    }, longPressDuration);
  }

  function handleTouchEnd() {
    if (timerId) clearTimeout(timerId!);
    if (!longPressDetected) shortPress();
    else longPressRealeased();
    setLongPressDetected(false);
  }
});


export default MouseCursor