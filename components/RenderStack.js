import React, { useEffect, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Import all necessary screen components
import AllContests from '../components/All Contest/AllContests';
import FlashDeals from '../components/FlashDeals';
import MostSharedDealsScreen from '../components/MostSharedDealsScreen';
import ReferAndEarn from '../components/ReferAndEarn';
import TelegramConfigure from '../components/TelegramConfigure/TelegramConfigure';
import TelegramBotPage from '../components/TelegramConfigure/TelegramBotPage';
import TrendingStoresScreen from '../components/TrendingStoresScreen';
import ProductDetails from '../components/ProductDetails';
import Stores from '../BottomTabNavigation/TabComponents/Stores';
import MyAccount from '../components/MyAccount';
import MyEarnings from '../components/MyEarnings';
import Home from '../BottomTabNavigation/TabComponents/Home';
import MakeLink from '../BottomTabNavigation/TabComponents/MakeLink';
import MyActivity from '../BottomTabNavigation/TabComponents/MyActivity';
import { colors } from '../src/utils/color';

const Stack = createNativeStackNavigator();

const SCREEN_MAPPINGS = {
  'Home': { routeName: 'Home', component: Home, options: { headerShown: false, title: '' } },
  'Converter': { routeName: 'MakeLink', component: MakeLink, options: { headerShown: true, title: 'Link Converter' } },
  'Store': { routeName: 'Store', component: Stores, options: { headerShown: true, title: 'Store' } },
  'My Account': { routeName: 'MyAccount', component: MyAccount, options: { headerShown: true, title: 'My Account' } },
  'My Earnings': { routeName: 'MyEarnings', component: MyEarnings, options: { headerShown: true, title: 'My Earnings' } },
  'My Activity': { routeName: 'MyActivity', component: MyActivity, options: { headerShown: true, title: 'My Activity' } },
  'Contests': { routeName: 'AllContests', component: AllContests, options: { headerShown: true, title: 'All Contests' } },
  'Flash Deals': { routeName: 'FlashDeals', component: FlashDeals, options: { headerShown: true, title: 'Flash Deals' } },
  'Most Shared Deals': { routeName: 'MostSharedDeals', component: MostSharedDealsScreen, options: { headerShown: true, title: 'Most Shared Deals' } },
  'Refer and Earn': { routeName: 'ReferAndEarn', component: ReferAndEarn, options: { headerShown: true, title: '', headerTransparent: true } },
  'Telegram': { routeName: 'TelegramConfiguration', component: TelegramConfigure, options: { headerShown: true, title: 'Channel Configuration' } }
};

const ROUTE_TO_SIDE_PANEL = Object.fromEntries(
  Object.entries(SCREEN_MAPPINGS).map(([sidePanelName, screenConfig]) => 
    [screenConfig.routeName, sidePanelName]
  )
);

const RenderStack = ({ selectedScreen, onScreenChange }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const handleNavigationStateChange = useCallback(() => {
    if (!isFocused) return;

    try {
      const state = navigation?.getState();
      
      if (!state?.routes?.length) {
        return;
      }

      const currentRoute = state.routes[state.index];
      if (!currentRoute) {
        return;
      }

      const currentRouteName = currentRoute.name;
      const sidePanelScreenName = ROUTE_TO_SIDE_PANEL[currentRouteName];
      
      if (sidePanelScreenName && sidePanelScreenName !== selectedScreen) {
        onScreenChange?.(sidePanelScreenName);
      }

      if (currentRoute.state?.routes?.length > 0 && 
          typeof currentRoute.state.index === 'number') {
        const nestedCurrentRoute = currentRoute.state.routes[currentRoute.state.index];
        if (nestedCurrentRoute) {
          const nestedSidePanelScreenName = ROUTE_TO_SIDE_PANEL[nestedCurrentRoute.name];
          if (nestedSidePanelScreenName && nestedSidePanelScreenName !== selectedScreen) {
            onScreenChange?.(nestedSidePanelScreenName);
          }
        }
      }
    } catch (error) {
      console.warn('Navigation state handling error:', error);
    }
  }, [navigation, selectedScreen, onScreenChange, isFocused]);


  useEffect(() => {
    if (!isFocused) return;

    try {
      const screenConfig = SCREEN_MAPPINGS[selectedScreen];
      if (screenConfig && navigation) {
        navigation.navigate(screenConfig.routeName);
      }
    } catch (error) {
      console.warn('Screen navigation error:', error);
    }
  }, [selectedScreen, navigation, isFocused]);

  useEffect(() => {
    if (!navigation) return;

    const unsubscribe = navigation.addListener('state', handleNavigationStateChange);
    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Navigation listener cleanup error:', error);
      }
    };
  }, [navigation, handleNavigationStateChange]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {Object.entries(SCREEN_MAPPINGS).map(([, screenConfig]) => (
        <Stack.Screen
          key={screenConfig.routeName}
          name={screenConfig.routeName}
          component={screenConfig.component}
          options={{
            ...screenConfig.options,
            animation: 'none'
          }}
        />
      ))}

      <Stack.Screen 
        name="TelegramBotPage" 
        component={TelegramBotPage}
        options={{ 
          headerShown: true, 
          title: 'Telegram Bot Configuration',
          animation: 'none'
        }} 
      />
      <Stack.Screen 
        name="ProductDetailsScreen" 
        component={ProductDetails}
        options={{ 
          headerShown: true, 
          title: '',
          animation: 'none'
        }}
      />
      <Stack.Screen 
        name="TrendingStoresScreen"
        component={TrendingStoresScreen}
        options={{ 
          headerShown: true, 
          title: 'Stores',
          animation: 'none'
        }}
      />
    </Stack.Navigator>
  );
};

export default React.memo(RenderStack);