import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { colors } from '../../src/utils/color';
import LinksHistory from '../../components/MyActivity/LinksHistory';
import ClickHistory from '../../components/MyActivity/ClickHistory';
import TabContainer from '../../components/TabContainer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const MyActivity = () => {
   const tabs = [
    { 
      name: 'LinkHistory', 
      label: 'Link History', 
      component: () => <LinksHistory /> 
    },
    { 
      name: 'ClicksHistory', 
      label: 'Clicks History', 
      component: () => <ClickHistory /> 
    },
   
  ];

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
   
    <TabContainer
      tabs={tabs}
      initialTab="LinkHistory"
     // onTabChange={(tabName) => console.log('Tab changed to:', tabName)}
    />
  
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default MyActivity;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:colors.white
  },
  activityTabText: {
    padding: 15,
    fontSize: 16,
    color: colors.black, // Default color for the text
  },
  selectedTab: {
    color: colors.colorPrimary, // Selected tab text color
    borderBottomWidth: 2, // Bottom border for selected tab
    borderBottomColor: colors.colorPrimary, // Color of the bottom border
  },
 
  datefilter: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    fontWeight: 'bold',
  },
});
