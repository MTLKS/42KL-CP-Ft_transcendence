const messageNotificationSound = new Audio('../../assets/sounds/new-message.wav');

export enum HitType {
  NONE,
  WALL,
  PADDLE,
  SCORE,
  BLOCK,
  SLOW_IN,
  SLOW_OUT,
  FAST_IN,
  FAST_OUT,
  BH_IN,
}

let SoundPath : string[] = [
  '',
  '../../assets/sounds/Wall.wav',
  '../../assets/sounds/Paddle.wav',
  '../../assets/sounds/Score.wav',
  '../../assets/sounds/Wall.wav',
  '../../assets/sounds/Slow.wav',
  '../../assets/sounds/SlowEnd.wav',
  '../../assets/sounds/Fast.wav',
  '',
  '../../assets/sounds/Slow.wav',
]

export const playNewMessageSound = () => {
  messageNotificationSound.addEventListener('loadedmetadata', () => {
    messageNotificationSound.play();
  });
}

// let isSoundPLaying: boolean[] = Array(SoundPath.length).fill(false);
export const playGameSound = (type: HitType) => {
  // if (isSoundPLaying[type])
    // return;
  // isSoundPLaying[type] = true;
  const audio = new Audio(SoundPath[type]);
  // audio.addEventListener('ended', () => {
    // isSoundPLaying[type] = false;
  // });
  audio.play();
}