// App.js - FIXED VERSION
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { NavigationContainer, getStateFromPath as defaultGetStateFromPath } from '@react-navigation/native';
import { StatusBar, View, Text, Platform, Alert, LogBox } from 'react-native';
import { AuthProvider } from './navigation/AuthContext';
import { colors } from './src/utils/color';
import AppNavigator from './navigation/AppNavigator';
import { authRoutes, mainRoutes, publicRoutes } from './navigation/Routes';
import { registerTranslation } from 'react-native-paper-dates';
import { ModalProvider } from './src/utils/modalService';
import { requestNotificationPermission } from './src/utils/Permission/permissions';
import { setupPushNotifications } from './src/utils/PushNotification/pushNotification';
import PrimaryGradientBackground from './src/utils/Gradient/PrimaryGradientBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
import defaultStyleSheet from './src/styles/defaultStylesSheet';
import LinearGradient from 'react-native-linear-gradient';
import { GlobalLoadingOverlay } from './src/utils/loadingService';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { startNetworkMonitoring } from './src/utils/networkMonitor';
import { runSplashNetworkCheck } from './src/utils/SplashNetworkChecker';


const generateLinkingConfig = () => {
  const screens = {};

  publicRoutes.forEach(route => {
    screens[route.name] = route.path;
  });

  authRoutes.forEach(route => {
    screens[route.name] = route.path;
  });

  screens.MainTabs = { screens: {} };
  mainRoutes
    .filter(route => route.tabVisible)
    .forEach(route => {
      screens.MainTabs.screens[route.name] = route.path;
    });

  mainRoutes
    .filter(route => !route.tabVisible && route.name !== 'MainTabs')
    .forEach(route => {
      if (route.parse) {
        screens[route.name] = { path: route.path, parse: route.parse };
      } else {
        screens[route.name] = route.path;
      }
    });

  return { screens };
};

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(Platform.OS !== 'web');
  
  LogBox.ignoreLogs([
    'Image: style.resizeMode is deprecated',
    'props.pointerEvents is deprecated'
  ]);

  // // ✅ FIX: StatusBar ko component mount hone se PEHLE set karo
  // useEffect(() => {
  //   // Android
  //   if (Platform.OS === 'android') {
  //     StatusBar.setBackgroundColor(colors.colorPrimary);
  //     StatusBar.setTranslucent(false);
  //     StatusBar.setBarStyle('light-content');
  //   } 
  //   // iOS
  //   else if (Platform.OS === 'ios') {
  //     StatusBar.setBarStyle('light-content', true);
  //   }
  // }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      requestNotificationPermission();
    }
  }, []);

  useEffect(() => {
    registerTranslation('en', {
      save: 'Save',
      selectSingle: 'Select date',
      selectMultiple: 'Select dates',
      selectRange: 'Select period',
      saveRange: 'Save period',
      startDate: 'Start date',
      endDate: 'End date',
      typeInDate: 'Type in date',
      close: 'Close',
      maximumDate: 'Maximum date',
      minimumDate: 'Minimum date',
      previous: 'Previous',
      next: 'Next',
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      setupPushNotifications();
    }
  }, []);

  // useEffect(() => {
  //   const cleanup = startNetworkMonitoring();
  //   return cleanup; // Cleanup on unmount
  // }, []);

  useEffect(() => {
    const init = async () => {
      if (Platform.OS !== 'web') {
        await runSplashNetworkCheck();           // Mobile: splash pe check
        await new Promise(r => setTimeout(r, 2500));
      }
  
      setIsSplashVisible(false);
      startNetworkMonitoring();                  // Web: load pe check, Mobile: splash result use
    };
  
    init();
  }, []);
  const linkingConfig = useMemo(() => generateLinkingConfig(), []);

  const linking = {
    prefixes: ["myapp://", "https://your-production-domain.com"],
    config: linkingConfig,
    getStateFromPath: (path, config) => {
      try {
        const state = defaultGetStateFromPath(path, config);
        if (!state) {
          return { routes: [{ name: 'Landing' }] };
        }
        return state;
      } catch (error) {
        console.warn("Deep link parse error:", error);
        return { routes: [{ name: 'Landing' }] };
      }
    },
  };

  // ✅ Splash Screen - StatusBar with proper settings
  if (isSplashVisible && Platform.OS === 'android') {
    return (
      <LinearGradient
        colors={[colors.colorPrimaryLite, colors.colorPrimary, colors.colorPurple || '#8B00FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Background Glow Effect */}
        <View style={styles.glowContainer}>
          <View style={styles.glowCircle} />
        </View>
  
        {/* Main Logo Container with Pulse Animation */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image

              source={require('./src/assets/icon.png')}
              style={styles.logoImage}
              resizeMode='stretch'
              
            
            />
          </View>
  
          {/* Pulsating Ring Effect */}
          <View style={[styles.pulseRing, styles.pulse1]} />
          <View style={[styles.pulseRing, styles.pulse2]} />
          <View style={[styles.pulseRing, styles.pulse3]} />
        </View>
  
        {/* App Name with Shine Effect */}
        <View style={styles.textContainer}>
          <Text style={styles.appName}>Offer's Pay</Text>
          <View style={styles.shineOverlay} />
        </View>
  
        {/* Tagline */}
        <Text style={styles.tagline}>Shop Smart, Earn Big!</Text>
  
        {/* Bottom Wave Decoration */}
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>
      </LinearGradient>
    );
  }

  // ✅ Main App - StatusBar with proper settings
  return (
    <>
      {/* ✅ IMPORTANT: StatusBar ko sabse TOP pe rakho */}
      <StatusBar 
        backgroundColor={colors.colorPrimary}
        translucent={true}
        barStyle="dark-content" 
      />
      <AuthProvider>
        <AppContent linking={linking} />
      </AuthProvider>
    </>
  );
}

const AppContent = ({ linking }) => {
  const navigationRef = useRef(null);

  const handleNavigationError = (error) => {
    console.warn('Navigation error:', error);
  };

  const handleStateChange = (state) => {
    if (!state) return;

    const currentRoute = navigationRef.current?.getCurrentRoute();
    if (currentRoute && Platform.OS === 'web') {
      const allRoutes = [
        ...publicRoutes.map(r => r.name),
        ...authRoutes.map(r => r.name),
        ...mainRoutes.map(r => r.name),
        'MainTabs',
        'NotFound',
      ];
 
      if (!allRoutes.includes(currentRoute.name)) {
        setTimeout(() => {
          navigationRef.current?.navigate('Landing');
        }, 0);
      }
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onError={handleNavigationError}
      onStateChange={handleStateChange}
    >
      <ModalProvider>
        <AppNavigator />
        <GlobalLoadingOverlay />
      </ModalProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    overflow:'hidden',
    shadowRadius: 20,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: 200,
    height: 200,
    resizeMode:'contain',
    overflow:'hidden',
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    top: -10,
    left: -10,
  },
  pulse1: {
    animation: 'pulse 2s infinite',
    animationDelay: '0s',
  },
  pulse2: {
    animation: 'pulse 2s infinite',
    animationDelay: '0.7s',
  },
  pulse3: {
    animation: 'pulse 2s infinite',
    animationDelay: '1.4s',
  },
  textContainer: {
    position: 'relative',
    overflow: 'hidden',
    marginTop: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  shineOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ skewX: '-20deg' }],
    animation: 'shine 3s infinite',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 10,
    fontWeight: '500',
    letterSpacing: 1,
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});