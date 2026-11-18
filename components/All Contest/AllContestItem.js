import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { colors } from '../../src/utils/color';
import defaultStyleSheet from '../../src/styles/defaultStylesSheet';

const AllContestItem = ({ item }) => {
  const imageSource = item.image.uri ? { uri: item.image.uri } : item.image;
  const isLargeScreen = Dimensions.get('window').width > 1024;

  return (
    <View style={[
      styles.contestItem,
      defaultStyleSheet.shadowProvider,
      isLargeScreen && styles.largeScreenItem
    ]}>
      <Image 
        source={imageSource}
        resizeMode='stretch'
        style={styles.offerImage}
      />
    </View>
  );
};

export default AllContestItem;

const styles = StyleSheet.create({
  contestItem: {
    borderRadius: 10,
    backgroundColor: colors.lightRed,
    margin: 10,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    overflow: 'hidden'
  },
  largeScreenItem: {
    height: 170,
    maxWidth:280,
    minWidth:210,
    aspectRatio: 16/9, // Maintains a consistent aspect ratio
  },
  offerImage: {
    width: '100%',
    height: '100%',
  },
});