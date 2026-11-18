// src/components/Layout/Layout.js

import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect, useNavigation, useNavigationState } from '@react-navigation/native';
import Header from './Header';
import Sidebar from './Sidebar';
import { useResponsive } from '../../src/utils/dimension';
import { colors } from '../../src/utils/color';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Layout = ({ children }) => {
  const { isDesktop } = useResponsive();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const [activeRoute, setActiveRoute] = useState('Home');

  // Har baar jab Layout wala screen focus mein aaye (ya tab change ho)

  // ✅ Fixed: Single source of truth for active route
  const activeRouteName = useNavigationState(state => {
    if (!state?.routes?.length) return 'Home';
    
    const route = state.routes[state.index];
    
    if (route.name === 'MainTabs') {
      return route.state?.routes?.[route.state.index ?? 0]?.name || 'Home';
    }
    
    return route.name;
  });

  const toggleSidebar = () => {
    if (!isDesktop) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigateToEarnings = () => {
    navigation.navigate('MyEarnings');
  };

  const handleSidebarNavigate = (routeName) => {
    // Pehle check karo: agar route tab ke andar hai (Home, Store, etc.)
    const tabRoutes = ['Home', 'Store', 'MakeLink', 'MyActivity', 'Profile'];
  
    if (tabRoutes.includes(routeName)) {
      // Tab route hai → MainTabs ke andar navigate karo
      navigation.navigate('MainTabs', { screen: routeName });
    } else {
      // Non-tab route hai (MyEarnings, ReferAndEarn, Notifications, etc.)
      navigation.navigate(routeName);
    }
  
    // Mobile pe sidebar band kar do
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={[defaultStyleSheet.safeArea]}>
      {isDesktop && (
        <Header
          onToggleSidebar={toggleSidebar}
          onNavigateToEarnings={handleNavigateToEarnings}
          showMenuButton={!isDesktop}
        />
      )}

      <View style={styles.mainContent}>
        {(isDesktop || isSidebarOpen) && (
          <Sidebar
            isOpen={isDesktop || isSidebarOpen}
            onClose={closeSidebar}
            onNavigate={handleSidebarNavigate}
            activeRoute={activeRouteName}
            isPermanent={isDesktop}
          />
        )}

        <SafeAreaView style={defaultStyleSheet.safeArea}>{children}</SafeAreaView>
        
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({

  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },

});

export default Layout;