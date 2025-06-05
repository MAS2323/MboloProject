import PushNotification from 'react-native-push-notification';

const configureNotifications = () => {
  if (!PushNotification) {
    console.error('PushNotification module is not available');
    return;
  }

  PushNotification.createChannel(
    {
      channelId: 'my_channel_id',
      channelName: 'My Channel Name',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`Channel created: ${created}`),
  );

  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
  });
};

export default configureNotifications;
