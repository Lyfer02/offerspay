import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';

// 1. Import your custom 'useResponsive' hook
//    (You may need to adjust this path based on your file structure)
import { useResponsive } from '../src/utils/dimension';

const Splash = () => {
  // const navigation = useNavigation();
  
  // 2. Call your custom hook to get responsive values.
  //    We'll assume it returns width, height, and device type booleans.
  const { width, isMobile } = useResponsive();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.dispatch(StackActions.replace('MainApp'));
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [navigation]);

  // 3. Use the values from your hook to create dynamic styles.
  // //    This logic is now powered by your centralized hook.
  const dynamicFontSize = width * 0.08;
  const titleColor = isMobile ? '#333' : '#555'; // Example: Use a different color if not on mobile

  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.text, 
          { 
            fontSize: dynamicFontSize,
            color: titleColor 
          }
        ]}
      >
        Splash Screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default Splash;