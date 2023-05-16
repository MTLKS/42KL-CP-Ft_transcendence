import audioUrl from '../../assets/sounds/new-message.wav?url';

const newMessageNotification = new Audio(process.env.PUBLIC_URL + `/assets/sounds/new-message.wav`);

export const playNewMessageSound = () => {
  newMessageNotification.addEventListener('loadedmetadata', () => {
    newMessageNotification.play();
  });
}
