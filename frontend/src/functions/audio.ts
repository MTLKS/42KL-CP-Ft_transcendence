const messageNotificationSound = new Audio('../../assets/sounds/new-message.wav');
const blackHoleSound = new Audio('../../assets/sounds/BlackHole.wav');

export enum HitType {
  NONE,
  WALL,
  PADDLE,
  SCORE,
  BLOCK,
  SLOW_IN,
  SLOW_OUT,
  FAST_IN,
  FAST_OUT
}

let SoundPath : string[] = [
  '',
  '../../assets/sounds/Wall.wav',
  '../../assets/sounds/Paddle.wav',
  '../../assets/sounds/Score.wav',
  '../../assets/sounds/Wall.wav',
  '../../assets/sounds/Slow.wav',
  '../../assets/sounds/SlowEnd.wav',
  '../../assets/sounds/Fast.wav'
]

export const playNewMessageSound = () => {
  messageNotificationSound.addEventListener('loadedmetadata', () => {
    messageNotificationSound.play();
  });
}

export const playGameSound = (type: HitType) => {
  new Audio(SoundPath[type]).play();
}

export const playBlackHoleSound = () => {
  blackHoleSound.play();
}

export const stopBlackHoleSound = () => {
  blackHoleSound.pause();
  blackHoleSound.currentTime = 0;
}