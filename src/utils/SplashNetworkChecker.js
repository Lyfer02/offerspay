// src/utils/SplashNetworkChecker.js
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

const REACHABILITY_URL = 'https://connectivitycheck.gstatic.com/generate_204';

export const runSplashNetworkCheck = async () => {
  if (Platform.OS === 'web') {
    // Web pe yeh file call hi nahi hogi
    return true;
  }

  try {
    const state = await NetInfo.fetch();

    // Agar koi network hi nahi (airplane mode)
    if (!state.isConnected) {
      global.isInternetAvailable = false;
      console.log('[Splash] No network connection');
      return false;
    }

    // Agar connected hai → real internet check (hotspot bhi detect karega)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    await fetch(REACHABILITY_URL + '?t=' + Date.now(), {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache',
      mode: 'no-cors',
    });

    clearTimeout(timeout);
    global.isInternetAvailable = true;
    console.log('[Splash] Real internet available');
    return true;

  } catch (error) {
    global.isInternetAvailable = false;
    console.log('[Splash] Fake WiFi / No real internet');
    return false;
  }
};