// ShareButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import IconComponent from './IconComponent';
import { colors } from '../src/utils/color';
import defaultStyleSheet from '../src/styles/defaultStylesSheet';

const IconButton = ({ onPress, iconName, iconColor, backgroundColor }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.iconContainer,
        { backgroundColor: backgroundColor || colors.white }, defaultStyleSheet.shadowProvider
      ]}
      activeOpacity={0.7}>
      <IconComponent name={iconName} size={24} color={iconColor || colors.colorPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 50, // Fully round button
    padding: 6,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
