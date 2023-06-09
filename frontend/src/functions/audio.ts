const messageNotificationSound = new Audio('../../assets/sounds/new-message.wav');
const blackHoleSound = new Audio('../../assets/sounds/BlackHole.wav');
const endGameSound = new Audio('../../assets/sounds/EndGame.wav');

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
  END_GAME
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
  '../../assets/sounds/EndGameExplosion.wav'
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
  blackHoleSound.volume = 1;
  blackHoleSound.play();
}

export const stopBlackHoleSound = () => {
  const fadeOutInterval = setInterval(() => {
    if (blackHoleSound.volume <= 0.1) {
      clearInterval(fadeOutInterval);
      blackHoleSound.pause();
      blackHoleSound.currentTime = 0;
    } else {
      blackHoleSound.volume -= 0.1;
    }
  }, 100);
};

export const playEngGameSound = () => {
  endGameSound.volume = 1;
  endGameSound.play();
}

export const stopEngGameSound = () => {
  const fadeOutInterval = setInterval(() => {
    if (endGameSound.volume <= 0.1) {
      clearInterval(fadeOutInterval);
      endGameSound.pause();
      endGameSound.currentTime = 0;
    } else {
      endGameSound.volume -= 0.1;
    }
  }, 100);
}
