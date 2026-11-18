// SliderItem.js - Updated for peek effect
import { Image, StyleSheet, View, Platform,  TouchableOpacity } from 'react-native';
import React from 'react';
import { colors } from '../../src/utils/color';
import { useResponsive } from '../../src/utils/dimension.js';
import { Linking } from 'react-native';
import UrlReplacer from '../../AdvancedMode/AdvancedModeTabFiles/UrlReplacer.js';

const SliderItem = ({ item, slideWidth }) => {
  const { width: screenWidth, isDesktop } = useResponsive();

  // Use passed slideWidth or fallback to calculation
  const itemWidth = slideWidth || (isDesktop ? Math.min(screenWidth * 0.7, 1200) : screenWidth * 0.75);

  // Adaptive height with desktop max limit
  const getAdaptiveHeight = (width) => {
    if (width < 480) return 150;
    if (width < 768) return 220;
    if (width < 1024) return 280;
    return 400; // desktop larger height
  };

  const sliderHeight = getAdaptiveHeight(itemWidth);

  const imageSource = item?.image
    ? { uri: item.image }
    : require('../../src/assets/no_data_found.jpg');

  const handlePress = async (url) => {
    console.log("this is log",url);
    
    if (!url) return;
    try {
      const supported = await Linking.openURL(url);
      // console.log("this is supported",supported);
      
     // if (supported) await Linking.openURL(url);
    } catch (err) {
      console.warn('Failed to open URL:', err);
    }
  };

  return (
    <View style={[styles.container, { width: itemWidth }]}>
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => { handlePress(item.url) }}
        style={[
          styles.imageWrapper,
          { height: sliderHeight, width: '100%' },
        ]}
      >
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          {...(Platform.OS === 'web' && {
            loading: 'lazy',
            decoding: 'async',
          })}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, // Reduced gap between slides
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.lightGreen,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

export default SliderItem;