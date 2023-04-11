import React, { useRef, useState } from 'react'
import useInterval from 'use-interval';

const VALID_CHARS: string = `abcdefghijklmnopqrstuvwxyz0123456789~!?@#$%^&*,.;"'_-+={}[]()<>`;
const STREAM_MUTATION_ODDS = 0.02;
const STREAM_MOVE_ODDS = 0.2;

const MIN_STREAM_SIZE: number = 10;
const MAX_STREAM_SIZE: number = 40;
const STREAM_SPEED: number = 50;
const MS_ANIM_DURATION: number = 80;

const getRandInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const getRandChar = () => VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));

const getRandStream = () => new Array(getRandInRange(MIN_STREAM_SIZE, MAX_STREAM_SIZE)).fill(undefined).map(_ => getRandChar());

const getMutatedStream = (stream: string[]) => {
  const newStream = [];

  for (let i = 1; i < stream.length; i++) {
    if (Math.random() < STREAM_MUTATION_ODDS)
      newStream.push(getRandChar());
    else
      newStream.push(stream[i]);
  }
  newStream.push(getRandChar());
  return newStream;
}

interface RainStreamProps {
  parentHeight: number;
}

function RainStream({ parentHeight }: RainStreamProps) {

  const [stream, setStream] = useState(getRandStream());
  const [topMargin, setTopMargin] = useState(0);

  // one drawback of using setInterval is that it will be re-rendered everytime react render this component, which means
  // every render has a new setInterval. So, can use useInterval (external lib) to have a dynamic setInterval

  useInterval(() => {
    if (topMargin > parentHeight)
      setTopMargin(0)
    else {
      if (Math.random() < STREAM_MOVE_ODDS)
        setTopMargin(topMargin + STREAM_SPEED);
      setStream(getMutatedStream);
    }
  }, MS_ANIM_DURATION)

  return (
    <div
      className='bg-dimshadow text-highlight [writing-mode:vertical-rl] [text-orientation:upright] whitespace-nowrap select-none text-sm ease-in'
      style={{
        marginTop: topMargin
      }}>
      {stream.map((char, index) => (
        <span
          key={index}
          style={{
            color: index === stream.length - 1 ? 'rgb(var(--highlight-color))' : undefined,
            opacity: index < 5 ? 0.1 + index * 0.15 : 1,
            marginTop: `-2px`,
            }}>
          {char}
        </span>
      ))}
    </div>
  )
}

export default RainStream