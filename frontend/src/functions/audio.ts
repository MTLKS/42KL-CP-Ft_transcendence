const NEW_MESSAGE_NOTIFICATION_SOUND = '../../assets/sounds/new-message.wav';

const newMessageNotification = new Audio(NEW_MESSAGE_NOTIFICATION_SOUND);

export const playNewMessageSound = () => {
  newMessageNotification.addEventListener('loadedmetadata', () => {
    newMessageNotification.play();
  });
}
