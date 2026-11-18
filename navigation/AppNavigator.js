// navigation/AppNavigator.js  ← Pura file replace kar do

import React, { useEffect, useMemo, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import { publicRoutes, authRoutes, mainRoutes } from './Routes';
import BottomTabNavigator from './BottomTabNavigator';
import Layout from '../components/Layout/Layout';
import storage from '../src/utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const LayoutWrappedBottomTabs = React.memo(() => (
  <Layout >
    <BottomTabNavigator />
  </Layout>
));

const createLayoutWrappedComponent = (Component) => {
  const Wrapped = (props) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );
  Wrapped.displayName = `LayoutWrapped(${Component.displayName || Component.name})`;
  return Wrapped;
};

const NotFoundScreen = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: isLoggedIn ? 'MainTabs' : 'Landing' }],
      });
    }, 500);
  }, [isLoggedIn, navigation]);

  return null; // blank screen while redirecting
};

export default function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const hasCheckedFirstLaunch = useRef(false);

  // First launch check only on mobile
  useEffect(() => {
    if (Platform.OS === 'web' || hasCheckedFirstLaunch.current) return;

    hasCheckedFirstLaunch.current = true;
    (async () => {
      const value = await storage.getItem('isAppFirstLaunched');
      if (value === null) {
        await storage.setItem('isAppFirstLaunched', 'false');
      }
    })();
  }, []);

  // Show nothing until auth is ready
  if (isLoading) {
    return null;
  }

  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* UNAUTH FLOW */}
      {!isLoggedIn ? (
        <>
          {publicRoutes.map(r => (
            <Stack.Screen key={r.name} name={r.name} component={r.component} options={r.options} />
          ))}
          {authRoutes.map(r => (
            <Stack.Screen key={r.name} name={r.name} component={r.component} options={r.options} />
          ))}
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={LayoutWrappedBottomTabs} />
          {mainRoutes
            .filter(r => !r.tabVisible)
            .map(route => (
              <Stack.Screen
                key={route.name}
                name={route.name}
                component={createLayoutWrappedComponent(route.component)}
                options={route.options}
              />
            ))}
        </>
      )}
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  
  );
}