import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions } from 'react-native';
import BottomTabNavigator from './BottomTabNavigation/BottomTabNavigation';
import AllContests from './components/All Contest/AllContests';
import FlashDeals from './components/FlashDeals';
import MostSharedDealsScreen from './components/MostSharedDealsScreen';
import ReferAndEarn from './components/ReferAndEarn';
import TelegramConfigure from './components/TelegramConfigure/TelegramConfigure';
import TelegramBotPage from './components/TelegramConfigure/TelegramBotPage';
import TrendingStoresScreen from './components/TrendingStoresScreen';
import ProductDetails from './components/ProductDetails';
import Stores from './BottomTabNavigation/TabComponents/Stores';
import MyAccount from './components/MyAccount';
import MyEarnings from './components/MyEarnings';
import WebCompatibleHome from './components/WebCompatibleHome';
import RenderStack from './components/RenderStack';
import Login from './components/Login';
import Signup from './components/Signup';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState('Home');

  useEffect(() => {
    const updateScreenState = () => {
      const { width } = Dimensions.get('window');
      setIsWideScreen(width > 1024);
    };

    updateScreenState();
    const subscription = Dimensions.addEventListener('change', updateScreenState);
    return () => subscription.remove();
  }, []);

  const handleScreenChange = (screenName) => {
    setSelectedScreen(screenName);
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="MainScreen"
    >
      <Stack.Screen
        name="MainScreen"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      
      {isWideScreen ? (
        <Stack.Screen
          name="RenderScreen"
          options={{ headerShown: false }}
        >
          {(props) => (
            <RenderStack 
              {...props} 
              selectedScreen={selectedScreen}
              onScreenChange={handleScreenChange}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen
            name="MyEarnings"
            component={MyEarnings}
            options={{ headerShown: true, title: 'My Earnings' }}
          />
          <Stack.Screen
            name="MyAccount"
            component={MyAccount}
            options={{ headerShown: true, title: 'My Account' }}
          />
          <Stack.Screen
            name="AllContests"
            component={AllContests}
            options={{ headerShown: true, title: 'All Contests' }}
          />
          <Stack.Screen
            name="FlashDeals"
            component={FlashDeals}
            options={{ headerShown: true, title: 'Flash Deals' }}
          />
          <Stack.Screen
            name="MostSharedDeals"
            component={MostSharedDealsScreen}
            options={{ headerShown: true, title: 'Most Shared Deals' }}
          />
          <Stack.Screen
            name="ReferAndEarn"
            component={ReferAndEarn}
            options={{ headerShown: true, title: '', headerTransparent: true }}
          />
          <Stack.Screen
            name="TelegramConfiguration"
            component={TelegramConfigure}
            options={{ headerShown: true, title: 'Channel Configuration' }}
          />
          <Stack.Screen
            name="TelegramBotPage"
            component={TelegramBotPage}
            options={{ headerShown: true, title: 'Telegram Bot Configuration' }}
          />
          <Stack.Screen
            name="TrendingStoresScreen"
            component={TrendingStoresScreen}
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen
            name="ProductDetailsScreen"
            component={ProductDetails}
            options={{ headerShown: true, title: '' }}
          />
          <Stack.Screen
            name="Store"
            component={Stores}
            options={{ headerShown: true, title: 'Store' }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;