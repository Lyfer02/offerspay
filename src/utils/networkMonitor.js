// src/utils/networkMonitor.js
import NetInfo from '@react-native-community/netinfo';
import { ErrorModalService } from './modalService';
import { BackHandler, Platform, Alert } from 'react-native';

let isShowingOffline = false;
let retryCount = 0;
const MAX_RETRIES = 2;

const showOfflineModal = () => {
  if (isShowingOffline) return;
  isShowingOffline = true;

  if (Platform.OS === 'web') {
    ErrorModalService.error(
      'No internet connection.\nPlease check your network and refresh.',
      {
        title: 'You are Offline',
        icon: 'wifi-off',
        confirmText: 'Refresh Page',
        onConfirm: () => window.location.reload(),
      }
    );
  } else {
    const left = MAX_RETRIES - retryCount;
    ErrorModalService.error(
      left > 0
        ? `No internet connection.\n\nAttempts left: ${left}`
        : 'No internet connection.\nMaximum attempts reached.',
      {
        title: 'No Internet',
        icon: 'wifi-off',
        confirmText: left > 0 ? 'Retry' : 'Close App',
        onConfirm: () => {
          isShowingOffline = false;
          if (left > 0) {
            retryCount++;
            setTimeout(() => checkAndShow(), 1000);
          } else {
            Alert.alert('Closing', 'No internet.', [{ text: 'OK', onPress: () => BackHandler.exitApp() }]);
         
         }
        },
      }
    );
  }
};

const showOnline = () => {
  if (isShowingOffline) {
    isShowingOffline = false;
    ErrorModalService.hide();
    ErrorModalService.success("You're back online!", {
      title: 'Connected',
      icon: 'wifi',
      confirmText: 'Great!',
    });
    setTimeout(() => ErrorModalService.hide(), 2000);
  }
};

const checkAndShow = async () => {
  if (Platform.OS === 'web') {
    if (navigator.onLine) showOnline();
    else showOfflineModal();
  } else {
    const state = await NetInfo.fetch();
    if (state.isConnected && global.isInternetAvailable !== false) {
      showOnline();
    } else {
      showOfflineModal();
    }
  }
};

export const startNetworkMonitoring = () => {
  retryCount = 0;
  isShowingOffline = false;

  // ================= WEB: Page load + refresh pe check =================
  if (Platform.OS === 'web') {
    const handle = () => checkAndShow();
    window.addEventListener('online', handle);
    window.addEventListener('offline', handle);
    window.addEventListener('load', handle); // page load pe
    handle(); // turant check

    return () => {
      window.removeEventListener('online', handle);
      window.removeEventListener('offline', handle);
      window.removeEventListener('load', handle);
    };
  }

  // ================= MOBILE: Splash result use karo =================
  if (global.isInternetAvailable === false) {
    console.log("Splash se offline detect hua → modal dikhata hun");
    showOfflineModal();
  }

  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      // reconnect → do real check
      setTimeout(async () => {
        try {
          await fetch('https://connectivitycheck.gstatic.com/generate_204', { method: 'HEAD', mode: 'no-cors' });
          global.isInternetAvailable = true;
          showOnline();
        } catch {
          showOfflineModal();
        }
      }, 1000);
    } else {
      global.isInternetAvailable = false;
      showOfflineModal();
    }
  });

  return () => unsubscribe();
};