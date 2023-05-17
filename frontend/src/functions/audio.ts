import audioUrl from '../../assets/sounds/new-message.wav?url';

const newMessageNotification = new Audio(audioUrl);

export const playNewMessageSound = () => {
  newMessageNotification.addEventListener('loadedmetadata', () => {
    newMessageNotification.play();
  });
}
