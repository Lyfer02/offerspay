// navigation/BottomTabNavigator.js
import React, { Suspense, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../src/utils/color';
import { useResponsive } from '../src/utils/dimension';
import { getTabRoutes } from './Routes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

// Loading fallback
const TabLoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <Text>Loading...</Text>
  </View>
);

// Lazy wrapper
const LazyTabScreen = ({ component: Component, ...props }) => (
  <Suspense fallback={<TabLoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

// Simple Elevated Tab Icon
const ElevatedTabIcon = ({ Icon, focused, size, color, label }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  //console.log("this is provided size for icon ",size);
  
  useEffect(() => {
    // Elevate animation - tab upar uthega
    Animated.spring(translateY, {
      toValue: focused ? -8 : 0,
      friction: 7,
      tension: 100,
      useNativeDriver: true,
    }).start();

    // Subtle scale
    Animated.spring(scaleValue, {
      toValue: focused ? 1.05 : 1,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleValue, translateY]);

  return (
    <Animated.View
      style={[
        styles.tabItem,
        {
          transform: [
            { translateY },
            { scale: scaleValue },
          ],
        },
      ]}
    >
      <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
        {focused && (
          <LinearGradient
            colors={[colors.colorPrimary, colors.colorPrimaryLite]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeGradient}
          />
        )}
        <Icon
          size={size}
          color={focused ? colors.white : colors.colorPrimary}
          strokeWidth={focused ? 2.5 : 2}
        />
      </View>
      
      
      {focused && (  <Animated.View style={[styles.labelContainer, { opacity: scaleValue }]}>
          <Text 
          allowFontScaling={false}
          style={styles.activeLabel}>{label}</Text>
        </Animated.View>)}
     
    </Animated.View>
  );
};

function BottomTabNavigator() {
  const { isDesktop } = useResponsive();
  const tabRoutes = useMemo(() => getTabRoutes(), []);

  const screenOptions = useCallback(
    ({ route }) => ({
      headerShown: false,
      tabBarIcon: ({  color, focused }) => {
        const routeConfig = tabRoutes.find(r => r.name === route.name);
        if (!routeConfig?.icon) return null;

        const Icon = routeConfig.icon;
        const label = routeConfig.label || route.name;

        return (
          <ElevatedTabIcon
            Icon={Icon}
            focused={focused}
            size={20}
            color={color}
            label={label}
          />
        );
      },
      tabBarActiveTintColor: colors.colorPrimary,
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: [
        styles.tabBarStyle,
        {
          display: isDesktop ? 'none' : 'flex',
          height: Platform.OS === 'ios' ? 60 : 60,
          // paddingBottom: Platform.OS === 'ios' ? 15 : 8,
        },
      ],
      tabBarItemStyle: styles.tabBarItem,
      tabBarShowLabel: false,
      lazy: true,
      unmountOnBlur: false,
    }),
    [isDesktop, tabRoutes]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={defaultStyleSheet.safeArea} edges={['top']}>
        <View style={styles.container}>
          <Tab.Navigator screenOptions={screenOptions}>
            {tabRoutes.map(route => (
              <Tab.Screen
                key={route.name}
                name={route.name}
                children={props => (
                  <LazyTabScreen component={route.component} {...props} />
                )}
              />
            ))}
          </Tab.Navigator>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#F3F4F6',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    paddingTop: 8,
  },
  tabBarItem: {
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
  },
  labelContainer: {
    // position: 'absolute',
    bottom: -2,
    // backgroundColor: colors.colorPrimary,
    paddingHorizontal:2,
    borderRadius: 10,
    minWidth: 50,
  },
  activeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.colorPrimary,
    textAlign: 'center',
    // letterSpacing: 0.5,
    // textTransform: 'uppercase',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 28,
    opacity:0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconBoxActive: {
    shadowColor: colors.colorPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 1,
  },
  activeGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.colorPrimary,
  },
});

export default React.memo(BottomTabNavigator);