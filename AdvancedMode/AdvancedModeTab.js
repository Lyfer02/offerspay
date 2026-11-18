import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { colors } from '../src/utils/color';
import Converter from './AdvancedModeTabFiles/Converter';
import SubIdConverter from './AdvancedModeTabFiles/SubIdConverter';
import ConfigureBitly from './AdvancedModeTabFiles/ConfigureBitly';
import Telegram from './AdvancedModeTabFiles/Telegram';
import FlipkartLinkSetting from './AdvancedModeTabFiles/FlipkartLinkSetting';
import UrlReplacer from './AdvancedModeTabFiles/UrlReplacer';
import AddAmazonTag from './AdvancedModeTabFiles/AddAmazonTag';
import TabContainer from '../components/TabContainer';

const Tab = createMaterialTopTabNavigator();
const windowWidth = Dimensions.get('window').width;

// const CustomTabBar = ({ state, descriptors, navigation }) => {
//   const scrollViewRef = useRef(null);

//   useEffect(() => {
//     if (scrollViewRef.current) {
//       scrollViewRef.current.scrollTo({ x: state.index * (windowWidth / 3), animated: true });
//     }
//   }, [state.index]);

//   return (
//     <SafeAreaView style={[styles.tabBarContainer, defaultStyleSheet.shadowProvider]}>
//       <ScrollView 
//         ref={scrollViewRef}
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.scrollViewContent}
//       >
//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const label = options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//           const isFocused = state.index === index;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: 'tabPress',
//               target: route.key,
//               canPreventDefault: true,
//             });

//             if (!isFocused && !event.defaultPrevented) {
//               navigation.navigate(route.name);
//             }
//           };

//           return (
//             <TouchableOpacity
//               key={route.key}
//               onPress={onPress}
//               activeOpacity={0.7}
//               style={[
//                 styles.tabItem,
//                 isFocused && styles.tabItemFocused
//               ]}
//             >
//               <Text style={[
//                 styles.tabItemText,
//                 isFocused && styles.tabItemTextFocused
//               ]}>
//                 {label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

const AdvancedModeTab = () => {
  const tabs = [
    { 
      name: 'Converter', 
      label: 'Converter', 
      component: () => <Converter /> 
    },
    { 
      name: 'SubId Converter', 
      label: 'SubId Converter', 
      component: () => <SubIdConverter/> 
    },
    // { 
    //   name: 'Configure Bitly', 
    //   label: 'Configure Bitly', 
    //   component: () => <ConfigureBitly/> 
    // },
    // { 
    //   name: 'telegram', 
    //   label: 'Telegram', 
    //   component: () => <Telegram/> 
    // },
    // { 
    //   name: 'Flipkart Link Setting', 
    //   label: 'Flipkart Link Setting', 
    //   component: () => <FlipkartLinkSetting/> 
    // },
    // { 
    //   name: 'Add Amazon Tag', 
    //   label: 'Add Amazon Tag', 
    //   component: () => <AddAmazonTag/> 
    // },
    // { 
    //   name: 'Url replacer', 
    //   label: 'Url replacer', 
    //   component: () => <UrlReplacer
    //   /> 
    // },
    
  ];


  // Remove console.log and return the JSX directly
  return (
    
    <TabContainer
      tabs={tabs}
      initialTab="Converter"
      // onTabChange={(tabName) => console.log('Tab changed to:', tabName)}
    />
  );
};

export default AdvancedModeTab;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 'auto',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  tabItem: {
    width: windowWidth / 3,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemFocused: {
    borderBottomColor: colors.colorPrimary,
  },
  tabItemText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  tabItemTextFocused: {
    color: colors.colorPrimary,
    fontWeight:'bold',
  },
});