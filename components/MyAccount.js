import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyEarningsTab, { CustomTabBar } from './MyEarnings';
import Profile from './MyAccountsTab/Profile';
import ManagePassword from './MyAccountsTab/ManagePassword';
import TabContainer from './TabContainer';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();

const MyAccount = () => {
  const tabs = [
    { 
      name: 'Profile', 
      label: 'Profile', 
      component: () => <Profile /> 
    },

    
  ];
    return(
<SafeAreaView style={{flex:1}}> 
      <TabContainer
      tabs={tabs}
      initialTab="Profile"
      onTabChange={(tabName) => console.log('Tab changed to:', tabName)}
    />
    </SafeAreaView>
    )
    


}

export default MyAccount;
