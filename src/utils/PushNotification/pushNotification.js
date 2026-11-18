// src/utils/PushNotification/pushNotification.js

import notifee, { 
  EventType, 
  AndroidImportance, 
  AndroidStyle,
  AndroidVisibility 
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform, AppState } from 'react-native';

// Channel create karne ka function
async function createChannel() {
  if (Platform.OS === 'web') return;

  const channelId = 'default-channel-id';

  // Check if channel exists
  const existingChannel = await notifee.getChannel(channelId);
  
  if (!existingChannel) {
    await notifee.createChannel({
      id: channelId,
      name: 'Default Channel',
      description: 'App notifications',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500],
      lights: true,
      lightColor: '#0068FF',
      bypassDnd: true,
      visibility: AndroidVisibility.PUBLIC,
    });
    console.log('Notification channel created!');
  } else {
    console.log('Notification channel already exists');
  }
}

// Local notification display function
async function displayLocalNotification(title, body, data = {}, imageUrl = null) {
  try {
    const notificationId = `notification_${Date.now()}`;

    const notificationConfig = {
      id: notificationId,
      title: title || 'New Notification',
      body: body || 'You have a new message',
      data: data,

      android: {
        channelId: 'default-channel-id',
        smallIcon: 'ic_launcher',
        color: '#0068FF',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default',
        },
        sound: 'default',
        vibrationPattern: [300, 500],
        showTimestamp: true,
        timestamp: Date.now(),
        visibility: AndroidVisibility.PUBLIC,
        autoCancel: true,
        ongoing: false,
        onlyAlertOnce: false,
      },

      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    };

    // Image support for Android
    if (imageUrl && imageUrl.length > 0 && !imageUrl.includes('localhost')) {
      notificationConfig.android.largeIcon = imageUrl;
      notificationConfig.android.style = {
        type: AndroidStyle.BIGPICTURE,
        picture: imageUrl,
      };
    }

    // Image support for iOS
    if (imageUrl && imageUrl.length > 0 && Platform.OS === 'ios' && !imageUrl.includes('localhost')) {
      notificationConfig.ios.attachments = [{ url: imageUrl }];
    }

    const displayedId = await notifee.displayNotification(notificationConfig);
    console.log('Notification displayed successfully:', displayedId);
    return displayedId;

  } catch (error) {
    console.error('Error displaying notification:', error);
    return null;
  }
}

// Extract notification data helper
function extractNotificationData(remoteMessage) {
  const data = remoteMessage.data || {};
  const notification = remoteMessage.notification || {};

  const title = data.title || notification.title || 'New Notification';
  const body = data.body || notification.body || 'You have a new message';
  
  let imageUrl = null;
  if (data.image && data.image.length > 0 && data.image !== '') {
    imageUrl = data.image;
  } else if (notification.android?.imageUrl) {
    imageUrl = notification.android.imageUrl;
  }

  return { title, body, imageUrl, data };
}

// Main setup function
export const setupPushNotifications = async () => {
  if (Platform.OS === 'web') return;

  try {
    // Channel create karo
    await createChannel();

    // FOREGROUND MESSAGE HANDLER
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('=== FOREGROUND FCM MESSAGE ===');
      console.log('Message:', JSON.stringify(remoteMessage, null, 2));

      const { title, body, imageUrl, data } = extractNotificationData(remoteMessage);
      console.log('Extracted:', { title, body, imageUrl });

      await displayLocalNotification(title, body, data, imageUrl);
    });

    // NOTIFICATION OPENED APP
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
    });

    // INITIAL NOTIFICATION (app killed state se open hua)
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      console.log('App opened from killed state:', initialNotification);
    }

    // TOKEN REFRESH
    const unsubscribeTokenRefresh = messaging().onTokenRefresh((newToken) => {
      console.log('FCM Token refreshed:', newToken);
    });

    console.log('Push notifications setup completed!');

    return () => {
      unsubscribeForeground();
      unsubscribeTokenRefresh();
    };

  } catch (error) {
    console.error('Push notification setup error:', error);
  }
};

// Background handler - YEH FILE KE BAHAR HONA CHAHIYE
export const setupBackgroundHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('=== BACKGROUND FCM MESSAGE ===');
    console.log('Message:', JSON.stringify(remoteMessage, null, 2));

    const { title, body, imageUrl, data } = extractNotificationData(remoteMessage);
    
    await displayLocalNotification(title, body, data, imageUrl);
  });
};

// Notifee background event handler
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('Notifee background event:', type, detail);
  
  if (type === EventType.PRESS) {
    console.log('User pressed notification:', detail.notification);
  }
});

// Notifee foreground event handler  
notifee.onForegroundEvent(({ type, detail }) => {
  console.log('Notifee foreground event:', type);
  
  if (type === EventType.PRESS) {
    console.log('User pressed notification:', detail.notification);
  }
  
  // DISMISSED event ko ignore karo - yeh normal hai
  if (type === EventType.DISMISSED) {
    console.log('Notification dismissed (normal behavior)');
  }
});

export { displayLocalNotification, createChannel };