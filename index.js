/**
 * @format
 */
import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './App.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidStyle, AndroidVisibility } from '@notifee/react-native';

// ============================================
// BACKGROUND MESSAGE HANDLER
// App.js load hone se PEHLE register hona zaroori hai
// ============================================
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('=== BACKGROUND FCM MESSAGE (index.js) ===');
  console.log('Full message:', JSON.stringify(remoteMessage, null, 2));

  const data = remoteMessage.data || {};
  const notification = remoteMessage.notification || {};

  const title = data.title || notification.title || 'New Notification';
  const body = data.body || notification.body || 'You have a new message';
  
  let imageUrl = null;
  if (data.image && data.image.length > 0 && data.image !== '' && !data.image.includes('localhost')) {
    imageUrl = data.image;
  }

  try {
    // Ensure channel exists
    const channelId = 'default-channel-id';
    const existingChannel = await notifee.getChannel(channelId);
    
    if (!existingChannel) {
      await notifee.createChannel({
        id: channelId,
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        visibility: AndroidVisibility.PUBLIC,
      });
    }

    // Display notification
    const notificationConfig = {
      id: `bg_notification_${Date.now()}`,
      title: title,
      body: body,
      data: data,
      android: {
        channelId: channelId,
        smallIcon: 'ic_launcher',
        color: '#0068FF',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        sound: 'default',
        showTimestamp: true,
        autoCancel: true,
        visibility: AndroidVisibility.PUBLIC,
      },
    };

    // Add image if available
    if (imageUrl) {
      notificationConfig.android.largeIcon = imageUrl;
      notificationConfig.android.style = {
        type: AndroidStyle.BIGPICTURE,
        picture: imageUrl,
      };
    }

    await notifee.displayNotification(notificationConfig);
    console.log('Background notification displayed successfully!');

  } catch (error) {
    console.error('Error displaying background notification:', error);
  }
});

// ============================================
// NOTIFEE BACKGROUND EVENT HANDLER
// ============================================
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('Notifee background event:', type);
});

// ============================================
// REGISTER APP
// ============================================
AppRegistry.registerComponent(appName, () => App);