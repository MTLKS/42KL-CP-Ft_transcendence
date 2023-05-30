const messageNotificationSound = new Audio('../../assets/sounds/new-message.wav');

export enum SoundType {
  SCORE,
  WALLHIT,
  PADDLEHIT
}

let SoundPath : string[] = [
  '../../assets/sounds/Score.wav',
  '../../assets/sounds/WallHit.wav',
  '../../assets/sounds/PaddleHit.wav'
]

export const playNewMessageSound = () => {
  messageNotificationSound.addEventListener('loadedmetadata', () => {
    messageNotificationSound.play();
  });
}

let isSoundPLaying: boolean[] = Array(SoundPath.length).fill(false);
export const playGameSound = (type: SoundType) => {
  if (isSoundPLaying[type])
    return;
  isSoundPLaying[type] = true;
  const audio = new Audio(SoundPath[type]);
  audio.addEventListener('ended', () => {
    isSoundPLaying[type] = false;
  });
  audio.play();
}